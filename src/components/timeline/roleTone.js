// Works out which team a decision maker belongs to, from their role text.
export function roleGroup(role = "") {
  const r = role.toLowerCase();
  if (r.includes("engineer")) return "eng";
  if (r.includes("manager") || r.includes("director") || r.includes("lead")) return "mgr";
  return "other";
}

export const roleCard = {
  eng: "bg-role-eng-soft border-role-eng/40",
  mgr: "bg-role-mgr-soft border-role-mgr/40",
  other: "bg-card border-border",
};

export const roleDot = {
  eng: "bg-role-eng",
  mgr: "bg-role-mgr",
  other: "bg-role-other",
};

export const roleLabel = {
  eng: "Engineering",
  mgr: "Management",
  other: "Other",
};