export const REL_STROKE = {
  "Caused this": "hsl(var(--risk-high))",
  "Affected by this": "hsl(var(--risk-med))",
  "Resolves this": "hsl(var(--risk-low))",
  "Blocks this": "hsl(var(--accent))",
  "Duplicates this": "hsl(var(--muted-foreground))",
};

export function buildGraph(changes, entries) {
  const nodes = [];
  const edges = [];
  const seen = new Set();

  changes.forEach((c, i) => {
    nodes.push({ id: `change-${c.id}`, kind: "Change", label: c.title, x: 140, y: 120 + i * 220, data: c });
  });

  entries.forEach((e, i) => {
    const dId = `decision-${e.id}`;
    nodes.push({ id: dId, kind: "Decision", label: e.chosen_option || e.title, x: 460, y: 120 + i * 220, data: e });
    if (e.change_id) edges.push({ from: `change-${e.change_id}`, to: dId, label: "Resolves this", disciplines: e.disciplines || [] });
    (e.jira_links || []).forEach((j, k) => {
      const jId = `jira-${j.key}`;
      if (!seen.has(jId)) {
        seen.add(jId);
        nodes.push({ id: jId, kind: "Jira", label: j.key, x: 800, y: 80 + (i * 2 + k) * 130, data: j });
      }
      edges.push({ from: dId, to: jId, label: j.relationship, disciplines: e.disciplines || [] });
    });
  });

  return { nodes, edges };
}