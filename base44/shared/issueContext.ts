// Loads a change issue with its discussion, evidence and latest analysis,
// and renders it as plain text context for an LLM prompt.
export async function loadIssueContext(base44, issueId) {
  const [issue, messages, facts, analyses] = await Promise.all([
    base44.entities.ChangeIssue.get(issueId),
    base44.entities.DiscussionMessage.filter({ issue_id: issueId }, "created_date", 100),
    base44.entities.EvidenceFact.filter({ issue_id: issueId }, "order", 100),
    base44.entities.CollisionAnalysis.filter({ issue_id: issueId }, "-created_date", 1),
  ]);
  const files = issue.project_id
    ? await base44.entities.ProjectFile.filter({ project_id: issue.project_id, use_in_analysis: true }, "-created_date", 15)
    : [];
  return { issue, messages, facts, analysis: analyses[0] || null, files };
}

export function contextText({ issue, messages, facts, analysis, files }) {
  const lines = [];
  lines.push(`CHANGE: ${issue.title}`);
  if (issue.description) lines.push(`Description: ${issue.description}`);
  lines.push(`Location: ${[issue.level, issue.zone].filter(Boolean).join(", ") || "not set"}`);
  lines.push(`Stage: ${issue.stage || "not set"} | Priority: ${issue.priority} | Collision risk: ${issue.collision_risk}`);
  lines.push(`Disciplines involved: ${(issue.disciplines || []).join(", ") || "not listed"}`);
  lines.push(`Related drawings: ${(issue.related_drawings || []).join(", ") || "none"}`);
  lines.push(`Owner: ${issue.owner || "not set"} (${issue.owner_role || "role not set"})`);

  if (analysis) {
    lines.push("\nLATEST COLLISION ANALYSIS:");
    if (analysis.summary) lines.push(`Summary: ${analysis.summary}`);
    if (analysis.exact_question) lines.push(`Open question: ${analysis.exact_question}`);
    if (analysis.impact_explanation) lines.push(`Impact: ${analysis.impact_explanation}`);
    (analysis.assumptions || []).forEach((a) => {
      lines.push(`Assumption [${a.discipline}] (${a.classification}): ${a.text}`);
    });
  }

  if (facts.length) {
    lines.push("\nEVIDENCE FACTS:");
    facts.forEach((f) => {
      lines.push(`[${f.discipline || "General"}] (${f.classification}, confidence ${f.confidence}): ${f.text}`);
    });
  }

  if (messages.length) {
    lines.push("\nDISCUSSION:");
    messages.forEach((m) => {
      const body = m.text || m.transcript || "";
      if (body) lines.push(`${m.author || "Someone"} [${m.discipline || "General"}]: ${body}`);
    });
  }

  if ((files || []).length) {
    lines.push("\nPROJECT FILES YOU CAN REFER TO:");
    files.forEach((f) => {
      lines.push(`${f.name} (${f.category}${f.discipline ? `, ${f.discipline}` : ""}): ${f.ai_summary || "no summary read"}`);
    });
  }

  return lines.join("\n");
}