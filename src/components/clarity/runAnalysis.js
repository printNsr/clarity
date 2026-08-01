import { base44 } from "@/api/base44Client";
import { logEvent } from "./clarityApi";

// Runs a collision analysis for an issue using its own discussion and evidence.
// Uses the LLM when possible and falls back to a deterministic summary built from the records.
export async function runAnalysis(issue, messages, facts) {
  const stated = facts.filter((f) => f.classification !== "Missing");
  const missing = facts.filter((f) => f.classification === "Missing");

  let projectFiles = [];
  if (issue.project_id) {
    projectFiles = await base44.entities.ProjectFile.filter(
      { project_id: issue.project_id, use_in_analysis: true },
      "-created_date",
      12,
    );
  }
  const fileText = projectFiles
    .filter((f) => f.ai_summary)
    .map((f) => `${f.name} (${f.category}): ${f.ai_summary}`)
    .join(" | ");

  let result = null;
  try {
    const prompt = `You are a construction coordination assistant. Analyse this design change for meaningful collisions between disciplines.
Change: ${issue.title}
Description: ${issue.description || ""}
Location: ${[issue.level, issue.zone].filter(Boolean).join(", ")}
Elements: ${(issue.elements || []).join(", ")}
Discussion: ${messages.map((m) => `${m.discipline} (${m.author}): ${m.transcript || m.text}`).join(" | ")}
Evidence: ${facts.map((f) => `${f.discipline} [${f.classification}]: ${f.text}`).join(" | ")}
Project files on record: ${fileText || "none uploaded"}
Use the project files as supporting evidence. When a file backs up a point, name that file in the summary or impact explanation.
Only report a collision when the assumptions really conflict.`;

    result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          collision_detected: { type: "boolean" },
          category: { type: "string" },
          severity: { type: "string" },
          summary: { type: "string" },
          exact_question: { type: "string" },
          impact_explanation: { type: "string" },
          assumptions: {
            type: "array",
            items: {
              type: "object",
              properties: { discipline: { type: "string" }, classification: { type: "string" }, text: { type: "string" } },
            },
          },
        },
      },
    });
  } catch (e) {
    result = null;
  }

  if (!result || typeof result.collision_detected !== "boolean") {
    const detected = missing.length > 0 || new Set(stated.map((f) => f.discipline)).size > 1;
    result = {
      collision_detected: detected,
      category: missing.length ? "Information gap" : "Contradictory assumption",
      severity: issue.priority === "High" ? "High" : "Medium",
      summary: detected
        ? "Differing assumptions could lead to RFI or rework."
        : "No meaningful collision detected.",
      exact_question: missing[0]?.text || "Can the current assumptions be held while meeting all discipline requirements?",
      impact_explanation: "Assumptions recorded by separate disciplines are not compatible, which may require drawing revisions, site rework or an RFI during construction.",
      assumptions: stated.slice(0, 2).map((f) => ({ discipline: f.discipline, classification: f.classification, text: f.text })),
    };
  }

  const analysis = await base44.entities.CollisionAnalysis.create({
    issue_id: issue.id,
    collision_detected: result.collision_detected,
    category: result.category,
    severity: ["High", "Medium", "Low"].includes(result.severity) ? result.severity : "Medium",
    summary: result.summary,
    exact_question: result.exact_question,
    impact_explanation: result.impact_explanation,
    assumptions: (result.assumptions || []).slice(0, 2),
    nodes: [...(issue.elements || []), issue.zone].filter(Boolean).slice(0, 4),
    status: "Confirmed",
  });

  await base44.entities.ChangeIssue.update(issue.id, {
    status: result.collision_detected ? "Potential Collision" : issue.status,
    collision_risk: result.collision_detected ? analysis.severity : "None",
  });

  await logEvent(issue, "analysis_completed", "Analysis completed", {
    description: analysis.summary,
    severity: analysis.severity,
  });
  if (result.collision_detected) {
    await logEvent(issue, "collision_detected", "Potential collision detected", {
      description: issue.title,
      severity: analysis.severity,
    });
  }

  return analysis;
}