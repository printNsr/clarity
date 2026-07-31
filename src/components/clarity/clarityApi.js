import { base44 } from "@/api/base44Client";

export async function logEvent(issue, event_type, title, extra = {}) {
  return base44.entities.WorkflowEvent.create({
    issue_id: issue?.id,
    project_id: issue?.project_id,
    event_type,
    title,
    occurred_at: new Date().toISOString(),
    ...extra,
  });
}

export async function nextRfiNumber(projectId) {
  const existing = await base44.entities.RFI.filter({ project_id: projectId });
  const max = existing.reduce((m, r) => {
    const n = parseInt(String(r.rfi_number).replace(/\D/g, ""), 10);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return `RFI-${String(max + 1).padStart(3, "0")}`;
}

export function fmtTime(value) {
  if (!value) return "";
  const d = new Date(value);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return sameDay ? `Today, ${time}` : `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

export function fmtAgo(value) {
  if (!value) return "";
  const mins = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 0)}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function fmtDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}