function cell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function exportEntriesCsv(entries) {
  const header = ["Date", "Change", "Decision", "Resolver", "Role", "Teams", "Conflict", "Options considered", "Chosen option", "Why chosen", "Jira items"];
  const rows = entries.map((e) => [
    e.decision_date,
    e.change_title,
    e.title,
    e.resolver,
    e.resolver_role,
    (e.disciplines || []).join(", "),
    e.conflict_text,
    (e.options || []).map((o) => `${o.label}${o.rejected_reason ? ` (not picked: ${o.rejected_reason})` : " (chosen)"}`).join(" | "),
    e.chosen_option,
    e.chosen_reason,
    (e.jira_links || []).map((j) => `${j.key} ${j.relationship} ${j.url}`).join(" | "),
  ]);
  const csv = [header, ...rows].map((r) => r.map(cell).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `clarity-decisions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}