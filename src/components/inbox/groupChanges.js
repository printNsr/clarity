const URGENCY_LABEL = { high: "High urgency", med: "Medium urgency", low: "Low urgency" };
const STATUS_LABEL = { unresolved: "Unresolved", draft: "Draft", resolved: "Resolved" };

const ORDER = {
  urgency: ["High urgency", "Medium urgency", "Low urgency"],
  status: ["Unresolved", "Draft", "Resolved"],
  decision: ["Needs a decision", "No decision needed"],
};

function keyFor(change, groupBy) {
  if (groupBy === "urgency") return URGENCY_LABEL[change.urgency] || "Urgency not set";
  if (groupBy === "status") return STATUS_LABEL[change.status] || "Status not set";
  if (groupBy === "decision")
    return change.needs_decision && change.status !== "resolved" ? "Needs a decision" : "No decision needed";
  if (groupBy === "owner") return change.decision_owner || "No owner yet";
  return "";
}

export function groupChanges(changes, groupBy) {
  if (groupBy === "none") return [{ label: "", changes }];
  const map = new Map();
  changes.forEach((c) => {
    const k = keyFor(c, groupBy);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(c);
  });
  const order = ORDER[groupBy];
  const keys = [...map.keys()].sort((a, b) => {
    if (!order) return a.localeCompare(b);
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  return keys.map((k) => ({ label: k, changes: map.get(k) }));
}