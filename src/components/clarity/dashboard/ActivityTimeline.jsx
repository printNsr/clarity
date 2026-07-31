import React from "react";
import { useNavigate } from "react-router-dom";
import RippleCard from "../RippleCard";
import TimelineMarker from "./TimelineMarker";
import { fmtDate } from "../clarityApi";

const DOT = {
  collision_detected: "bg-[#EF4444]",
  analysis_completed: "bg-[#F59E0B]",
  decision_recorded: "bg-[#F59E0B]",
  rfi_sent: "bg-[#2563EB]",
  verified: "bg-[#16A34A]",
  change_created: "bg-[#2563EB]",
};

export default function ActivityTimeline({ events }) {
  const navigate = useNavigate();
  const stamps = events.map((e) => new Date(e.occurred_at || e.created_date).getTime()).filter((t) => !Number.isNaN(t));
  const end = Date.now();
  const start = stamps.length ? Math.min(...stamps, end - 86400000) : end - 7 * 86400000;
  const span = Math.max(end - start, 1);

  // Position each milestone by time, then nudge overlapping dots apart so all stay readable.
  const spaced = events
    .map((event) => ({
      event,
      left: Math.min(97, Math.max(3, ((new Date(event.occurred_at || event.created_date).getTime() - start) / span) * 100)),
    }))
    .sort((a, b) => a.left - b.left)
    .map((item, idx, arr) => {
      const prev = arr[idx - 1];
      if (prev && item.left - prev.left < 5) item.left = Math.min(97, prev.left + 5);
      return item;
    });

  return (
    <RippleCard className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <h2 className="text-[14px] font-semibold">Activity Timeline</h2>
      <p className="mt-1 text-[11px] leading-relaxed text-[#6B7280]">
        Every milestone on one time bar, oldest on the left and now on the right. Hover a dot to see what happened.
      </p>

      <div className="relative mt-6 h-3">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#F1F5F9] via-[#FDE68A] to-[#FACC15]" />
        {spaced.map(({ event: e, left }) => {
          return (
            <TimelineMarker
              key={e.id}
              event={e}
              left={left}
              color={DOT[e.event_type] || "bg-[#6B7280]"}
              onClick={() => e.issue_id && navigate(`/changes/${e.issue_id}`)}
            />
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-[#6B7280]">
        <span>{fmtDate(new Date(start).toISOString())}</span>
        <span>{fmtDate(new Date(start + span / 2).toISOString())}</span>
        <span>Now</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-[#F1F5F9] pt-3 text-[10px] text-[#6B7280]">
        <Key color="bg-[#EF4444]" label="Collision" />
        <Key color="bg-[#F59E0B]" label="Decision" />
        <Key color="bg-[#2563EB]" label="RFI or new change" />
        <Key color="bg-[#16A34A]" label="Verified" />
      </div>

      {events.length === 0 ? <p className="mt-3 text-[12px] text-[#6B7280]">Nothing logged yet.</p> : null}
    </RippleCard>
  );
}

function Key({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`h-2 w-2 rounded-full ${color}`} /> {label}
    </span>
  );
}