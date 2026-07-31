import React from "react";
import { CircleCheck, TriangleAlert, Gavel, Send, FileText, RefreshCcw, CirclePlus } from "lucide-react";
import { fmtTime } from "../clarityApi";

const ICONS = {
  change_created: { Icon: CirclePlus, color: "text-[#16A34A]" },
  collision_detected: { Icon: TriangleAlert, color: "text-[#EF4444]" },
  analysis_completed: { Icon: RefreshCcw, color: "text-[#F59E0B]" },
  decision_recorded: { Icon: Gavel, color: "text-[#F59E0B]" },
  rfi_sent: { Icon: Send, color: "text-[#2563EB]" },
  drawing_updated: { Icon: FileText, color: "text-[#7C3AED]" },
  verified: { Icon: CircleCheck, color: "text-[#16A34A]" },
  invalidated: { Icon: TriangleAlert, color: "text-[#EF4444]" },
  reanalysis: { Icon: RefreshCcw, color: "text-[#F59E0B]" },
};

export default function WorkflowTimeline({ events }) {
  return (
    <div>
      <h2 className="text-[14px] font-semibold">Workflow Timeline</h2>
      <ol className="mt-3 space-y-0">
        {events.length === 0 ? <p className="text-[12px] text-[#6B7280]">No events yet.</p> : null}
        {events.map((e, i) => {
          const { Icon, color } = ICONS[e.event_type] || ICONS.change_created;
          return (
            <li key={e.id} className="relative flex gap-3 pb-6 last:pb-0">
              {i < events.length - 1 ? <span className="absolute left-[13px] top-7 h-full w-px bg-[#E5E7EB]" /> : null}
              <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] bg-white">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
              </span>
              <span>
                <span className="block text-[13px] font-medium">{e.title}</span>
                <span className="block text-[11px] text-[#6B7280]">{fmtTime(e.occurred_at || e.created_date)}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}