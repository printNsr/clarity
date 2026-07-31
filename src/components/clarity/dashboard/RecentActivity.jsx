import React from "react";
import { useNavigate } from "react-router-dom";
import { TriangleAlert, CircleCheck, Send, Activity } from "lucide-react";
import StatusBadge from "../StatusBadge";
import { fmtAgo } from "../clarityApi";
import RippleCard from "../RippleCard";

const ICONS = {
  collision_detected: { Icon: TriangleAlert, color: "text-[#EF4444]" },
  analysis_completed: { Icon: Activity, color: "text-[#F59E0B]" },
  rfi_sent: { Icon: Send, color: "text-[#2563EB]" },
  verified: { Icon: CircleCheck, color: "text-[#16A34A]" },
};

export default function RecentActivity({ events }) {
  const navigate = useNavigate();
  return (
    <RippleCard className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <h2 className="text-[14px] font-semibold">Recent Activity</h2>
      <div className="mt-2 divide-y divide-[#F1F5F9]">
        {events.length === 0 ? (
          <p className="py-4 text-[12px] text-[#6B7280]">No activity yet.</p>
        ) : (
          events.map((e) => {
            const { Icon, color } = ICONS[e.event_type] || { Icon: Activity, color: "text-[#6B7280]" };
            return (
              <button
                key={e.id}
                onClick={() => e.issue_id && navigate(`/changes/${e.issue_id}`)}
                className="flex w-full items-center gap-3 py-2.5 text-left hover:bg-[#F8FAFC]"
              >
                <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">{e.title}</span>
                  <span className="block truncate text-[11px] text-[#6B7280]">{e.description}</span>
                </span>
                <StatusBadge>{e.severity || "Info"}</StatusBadge>
                <span className="w-16 shrink-0 text-right text-[11px] text-[#6B7280]">{fmtAgo(e.occurred_at || e.created_date)}</span>
              </button>
            );
          })
        )}
      </div>
    </RippleCard>
  );
}