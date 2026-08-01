import React from "react";
import { Sparkles } from "lucide-react";
import StatusBadge from "@/components/clarity/StatusBadge";
import { fmtTime } from "@/components/clarity/clarityApi";

export default function AiUsageLogCard({ logs }) {
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[#7C3AED]" />
        <p className="text-[14px] font-semibold">AI usage log</p>
      </div>
      <p className="mt-1 text-[12px] text-[#6B7280]">Every AI run, newest first.</p>
      {logs.length === 0 ? (
        <p className="mt-3 text-[12px] text-[#6B7280]">No AI runs recorded yet.</p>
      ) : (
        <div className="mt-3 max-h-[420px] divide-y divide-[#F1F5F9] overflow-y-auto">
          {logs.map((l) => (
            <div key={l.id} className="py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] font-medium">{l.feature}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge tone={l.status === "Failed" ? "red" : "green"}>{l.status}</StatusBadge>
                  <span className="text-[11px] text-[#6B7280]">{fmtTime(l.ran_at || l.created_date)}</span>
                </div>
              </div>
              {l.reference ? <p className="mt-0.5 text-[11px] text-[#6B7280]">{l.reference}</p> : null}
              {l.output_summary ? (
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#6B7280]">{l.output_summary}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}