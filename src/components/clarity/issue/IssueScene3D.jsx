import React, { useMemo } from "react";
import HotspotScene3D from "@/components/clarity/dashboard/HotspotScene3D";
import { roomForIndex, roomsForFloor } from "@/components/clarity/dashboard/houseLayout";

const SEV = { High: { fill: "#EF4444", r: 11 }, Medium: { fill: "#F59E0B", r: 8.5 }, Low: { fill: "#FDBA74", r: 6 } };

/** Shows where this one change sits in the building. Drag to spin, hover a room or the marker for details. */
export default function IssueScene3D({ issue }) {
  const level = issue.level || "Ground floor";
  const floorIndex = Math.max(0, (level.match(/\d+/) ? Number(level.match(/\d+/)[0]) - 1 : 0));
  const rooms = roomsForFloor(floorIndex);

  const spots = useMemo(() => {
    const room = roomForIndex(rooms, 0, floorIndex);
    return [
      {
        issue,
        px: room.x + room.w / 2,
        pz: room.z + room.d / 2,
        sev: SEV[issue.collision_risk] || SEV.Low,
      },
    ];
  }, [issue, rooms, floorIndex]);

  return (
    <HotspotScene3D
      spots={spots}
      rooms={rooms}
      floors={[level]}
      floor={level}
      height={380}
      viewW={380}
      viewH={380}
      zoom={1.3}
      onSelectFloor={() => {}}
      onOpen={() => {}}
    />
  );
}