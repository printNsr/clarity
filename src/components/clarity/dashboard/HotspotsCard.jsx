import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FloorPlan from "../FloorPlan";

const SEV = { High: { fill: "#EF4444", r: 26 }, Medium: { fill: "#F59E0B", r: 20 }, Low: { fill: "#F59E0B", r: 13 } };

export default function HotspotsCard({ issues }) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(null);

  const spots = issues
    .filter((i) => i.collision_risk && i.collision_risk !== "None")
    .slice(0, 6)
    .map((i, idx) => ({
      issue: i,
      x: i.hotspot_x ?? 70 + ((idx * 61) % 280),
      y: i.hotspot_y ?? 70 + ((idx * 47) % 120),
      sev: SEV[i.collision_risk] || SEV.Low,
    }));

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">Collision Hotspots</h2>
        <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
          <Legend color="#EF4444" label="High" />
          <Legend color="#F59E0B" label="Med" />
          <Legend color="#FDBA74" label="Low" />
        </div>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-[#6B7280]">
        A simple floor plan of the building. Each circle marks a spot on the plan where two or more
        trades clash. Bigger and redder means higher risk. Click a circle to open the change.
      </p>
      <div className="relative mt-2">
        <FloorPlan height={220}>
          {spots.map((s) => (
            <circle
              key={s.issue.id}
              cx={s.x}
              cy={s.y}
              r={s.sev.r}
              fill={s.sev.fill}
              fillOpacity="0.3"
              stroke={s.sev.fill}
              strokeOpacity="0.6"
              className="cursor-pointer"
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(null)}
              onClick={() => navigate(`/changes/${s.issue.id}`)}
            />
          ))}
        </FloorPlan>
        {hover ? (
          <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[11px] shadow-sm">
            <p className="font-medium">{[hover.issue.level, hover.issue.zone].filter(Boolean).join(", ") || hover.issue.title}</p>
            <p className="text-[#6B7280]">1 conflict · {hover.issue.collision_risk} severity</p>
          </div>
        ) : null}
        {spots.length === 0 ? (
          <p className="absolute inset-x-0 bottom-2 text-center text-[12px] text-[#6B7280]">No collisions detected yet.</p>
        ) : null}
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}