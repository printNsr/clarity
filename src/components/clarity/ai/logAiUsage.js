import { base44 } from "@/api/base44Client";

// Records one AI run so the Organisation page can show usage and stored output size.
export async function logAiUsage({ feature, project_id, reference, input_summary, output, status = "Success" }) {
  const text = typeof output === "string" ? output : output ? JSON.stringify(output) : "";
  return base44.entities.AiUsageLog.create({
    feature,
    project_id,
    reference,
    input_summary: (input_summary || "").slice(0, 300),
    output_summary: text.slice(0, 600),
    output_chars: text.length,
    status,
    ran_at: new Date().toISOString(),
  });
}