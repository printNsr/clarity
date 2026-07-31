// Builds a plain text snapshot of everything happening in the business,
// used as context for the Clarity assistant chat.
export async function loadAppContext(base44) {
  const [projects, issues, rfis, decisions, drawings, events, updates, analyses] = await Promise.all([
    base44.entities.Project.list("-created_date", 20),
    base44.entities.ChangeIssue.list("-created_date", 120),
    base44.entities.RFI.list("-created_date", 60),
    base44.entities.Decision.list("-created_date", 60),
    base44.entities.Drawing.list("-created_date", 60),
    base44.entities.WorkflowEvent.list("-occurred_at", 60),
    base44.entities.TradeUpdate.list("-posted_at", 40),
    base44.entities.CollisionAnalysis.list("-created_date", 40),
  ]);
  return { projects, issues, rfis, decisions, drawings, events, updates, analyses };
}

export function appContextText(d) {
  const name = (id) => d.projects.find((p) => p.id === id)?.name || "Unknown project";
  const issueTitle = (id) => d.issues.find((i) => i.id === id)?.title || "unknown change";
  const lines = [];

  lines.push("PROJECTS:");
  d.projects.forEach((p) => lines.push(`- ${p.name} (${p.code || "no code"}) stage ${p.stage || "not set"} at ${p.location || "location not set"}`));

  lines.push("\nDESIGN CHANGES:");
  d.issues.forEach((i) => lines.push(
    `- [${name(i.project_id)}] ${i.title} | status ${i.status} | priority ${i.priority} | collision risk ${i.collision_risk} | location ${[i.level, i.zone].filter(Boolean).join(", ") || "not set"} | disciplines ${(i.disciplines || []).join(", ") || "none"} | owner ${i.owner || "not set"} | due ${i.due_date || "not set"}`
  ));

  if (d.analyses.length) {
    lines.push("\nCOLLISION ANALYSES:");
    d.analyses.forEach((a) => lines.push(`- ${issueTitle(a.issue_id)}: ${a.summary || "no summary"} (severity ${a.severity}, ${a.status})`));
  }

  if (d.decisions.length) {
    lines.push("\nDECISIONS:");
    d.decisions.forEach((x) => lines.push(`- ${issueTitle(x.issue_id)}: ${x.resolution || x.title || "no resolution text"} | status ${x.status} | owner ${x.owner || "not set"} | reason ${x.reason || "not given"}`));
  }

  if (d.rfis.length) {
    lines.push("\nRFIs:");
    d.rfis.forEach((r) => lines.push(`- ${r.rfi_number} ${r.title || ""} | status ${r.status} | priority ${r.priority} | about ${issueTitle(r.issue_id)} | question ${r.question || "not written"}`));
  }

  if (d.drawings.length) {
    lines.push("\nDRAWINGS:");
    d.drawings.forEach((w) => lines.push(`- ${w.drawing_number} rev ${w.revision || "?"} ${w.title || ""} | ${w.discipline || "no discipline"} | status ${w.status}`));
  }

  if (d.updates.length) {
    lines.push("\nSITE AND TRADE UPDATES:");
    d.updates.forEach((u) => lines.push(`- ${u.title} | ${u.kind} | ${u.discipline || "no discipline"} by ${u.rep_name || "someone"} | urgency ${u.urgency} | ${u.body || ""}`));
  }

  if (d.events.length) {
    lines.push("\nRECENT ACTIVITY:");
    d.events.forEach((e) => lines.push(`- ${e.occurred_at || ""} ${e.event_type}: ${e.title}${e.description ? ` (${e.description})` : ""}`));
  }

  return lines.join("\n");
}