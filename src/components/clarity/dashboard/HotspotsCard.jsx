import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HotspotScene3D from "./HotspotScene3D";
import { roomForIndex, roomsForFloor } from "./houseLayout";
import RippleCard from "../RippleCard";

const SEV = { High: { fill: "#EF4444", r: 11 }, Medium: { fill: "#F59E0B", r: 8.5 }, Low: { fill: "#FDBA74", r: 6 } };

export default function HotspotsCard({ issues }) {
  const navigate = useNavigate();

  const collisions = useMemo(
    () => issues.filter((i) => i.collision_risk && i.collision_risk !== "None"),
    [issues]
  );

  const floors = useMemo(() => {
    const found = [...new Set(collisions.map((i) => i.level).filter(Boolean))].sort();
    return found.length ? found : ["Ground floor"];
  }, [collisions]);

  const [floor, setFloor] = useState(null);
  const active = floor && floors.includes(floor) ? floor : floors[0];
  const floorIndex = Math.max(0, floors.indexOf(active));
  const rooms = roomsForFloor(floorIndex);

  const spots = collisions
    .filter((i) => (i.level || floors[0]) === active)
    .slice(0, 7)
    .map((i, idx) => {
      const room = roomForIndex(rooms, idx, floorIndex);
      return {
        issue: i,
        px: room.x + room.w / 2,
        pz: room.z + room.d / 2,
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
        A 3D model of the building with its rooms. Pick a floor on the left, drag to spin the view all the
        way around, hover a marker to read what clashes there and click it to open the change.
      </p>
      <div className="mt-2">
        <HotspotScene3D
          spots={spots}
          rooms={rooms}
          floors={floors}
          floor={active}
          onSelectFloor={setFloor}
          onOpen={(issue) => navigate(`/changes/${issue.id}`)}
        />
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