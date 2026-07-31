import React from "react";
import { useNavigate } from "react-router-dom";
import HotspotScene3D from "./HotspotScene3D";
import RippleCard from "../RippleCard";

const SEV = { High: { fill: "#EF4444", r: 11 }, Medium: { fill: "#F59E0B", r: 8.5 }, Low: { fill: "#FDBA74", r: 6 } };

export default function HotspotsCard({ issues }) {
  const navigate = useNavigate();

  const spots = issues
    .filter((i) => i.collision_risk && i.collision_risk !== "None")
    .slice(0, 6)
    .map((i, idx) => {
      // Values of 1 or less are stored as a fraction of the plan, anything larger is a plan coordinate.
      const fx = i.hotspot_x == null ? ((idx * 61) % 280) / 280 : i.hotspot_x <= 1 ? i.hotspot_x : Math.min(i.hotspot_x / 400, 1);
      const fz = i.hotspot_y == null ? ((idx * 47) % 120) / 120 : i.hotspot_y <= 1 ? i.hotspot_y : Math.min(i.hotspot_y / 240, 1);
      return {
        issue: i,
        px: 4 + fx * 32,
        pz: 4 + fz * 16,
        sev: SEV[i.collision_risk] || SEV.Low,
      };
    });

  return (
    <RippleCard className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">Collision Hotspots</h2>
        <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
          <Legend color="#EF4444" label="High" />
          <Legend color="#F59E0B" label="Med" />
          <Legend color="#FDBA74" label="Low" />
        </div>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-[#6B7280]">
        A 3D view of the building. Each marker sits where two or more trades clash. Bigger and redder
        means higher risk. Drag to spin the view all the way around and click a marker to open the change.
      </p>
      <div className="mt-2">
        <HotspotScene3D spots={spots} onOpen={(issue) => navigate(`/changes/${issue.id}`)} />
      </div>
    </RippleCard>
  );
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}