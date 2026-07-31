import React from "react";
import StatusBadge from "@/components/clarity/StatusBadge";

export default function PlanSummary({ plan }) {
  const rooms = plan?.rooms || [];
  return (
    <div className="space-y-3">
      <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-4">
        <p className="text-[13px] font-medium">Rooms we read ({rooms.length})</p>
        <div className="mt-2 space-y-1.5">
          {rooms.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-2 text-[12px]">
              <span className="truncate">{r.name}</span>
              <span className="flex items-center gap-2 whitespace-nowrap text-[#6B7280]">
                {Number(r.width || 0).toFixed(1)}m x {Number(r.depth || 0).toFixed(1)}m
                {r.confidence && <StatusBadge>{r.confidence}</StatusBadge>}
              </span>
            </div>
          ))}
          {rooms.length === 0 && <p className="text-[12px] text-[#6B7280]">No rooms found on this plan.</p>}
        </div>
      </div>

      {plan?.text_found?.length > 0 && (
        <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-4">
          <p className="text-[13px] font-medium">Text read from the plan</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {plan.text_found.map((t, i) => (
              <span key={i} className="rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-0.5 text-[11px] text-[#6B7280]">{t}</span>
            ))}
          </div>
        </div>
      )}

      {plan?.notes?.length > 0 && (
        <div className="rounded-[14px] border border-[#E5E7EB] bg-white p-4">
          <p className="text-[13px] font-medium">Worth checking</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] text-[#6B7280]">
            {plan.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}