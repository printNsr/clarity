import React from "react";
import { fmtTime } from "../clarityApi";

const DOT = {
  collision_detected: "bg-[#EF4444]",
  analysis_completed: "bg-[#F59E0B]",
  decision_recorded: "bg-[#F59E0B]",
  rfi_sent: "bg-[#2563EB]",
  verified: "bg-[#16A34A]",
  change_created: "bg-[#2563EB]",
};

export default function ActivityTimeline({ events }) {
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <h2 className="text-[14px] font-semibold">Activity Timeline</h2>
      <ol className="mt-3 space-y-4">
        {events.length === 0 ? <p className="text-[12px] text-[#6B7280]">Nothing logged yet.</p> : null}
        {events.map((e) => (
          <li key={e.id} className="flex items-start gap-2">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[e.event_type] || "bg-[#6B7280]"}`} />
            <span className="text-[11px] text-[#6B7280]">{fmtTime(e.occurred_at || e.created_date)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}