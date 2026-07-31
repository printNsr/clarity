import React, { useMemo, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

const WALLS = ["north", "south", "east", "west"];

/** Builds flat quads (floors and walls) in 3D space from the room rectangles. */
function buildFaces(rooms, doors, height) {
  const faces = [];
  rooms.forEach((r) => {
    const x0 = r.x, x1 = r.x + r.width, z0 = r.y, z1 = r.y + r.depth;
    faces.push({
      kind: "floor",
      fill: "#F1F5F9",
      stroke: "#CBD5E1",
      label: r.name,
      points: [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]],
    });

    WALLS.forEach((wall) => {
      const door = doors.find((d) => d.room === r.name && d.wall === wall);
      const horizontal = wall === "north" || wall === "south";
      const len = horizontal ? r.width : r.depth;
      const doorW = door ? Math.min(door.width, len - 0.4) : 0;
      const hasDoor = doorW > 0.2;
      const solid = hasDoor ? (len - doorW) / 2 : len;
      const starts = hasDoor ? [0, solid + doorW] : [0];

      starts.forEach((offset) => {
        const a = horizontal ? [x0 + offset, wall === "north" ? z1 : z0] : [wall === "east" ? x1 : x0, z0 + offset];
        const b = horizontal ? [x0 + offset + solid, a[1]] : [a[0], z0 + offset + solid];
        faces.push({
          kind: "wall",
          fill: horizontal ? "#E2E8F0" : "#D8DFE8",
          stroke: "#B8C2CF",
          points: [
            [a[0], 0, a[1]],
            [b[0], 0, b[1]],
            [b[0], height, b[1]],
            [a[0], height, a[1]],
          ],
        });
      });
    });
  });
  return faces;
}

export default function PlanModel3D({ plan }) {
  const rooms = plan?.rooms || [];
  const height = plan?.wall_height || 2.7;
  const [view, setView] = useState({ yaw: 0.7, pitch: 0.95, zoom: 1 });
  const drag = useRef(null);

  const bounds = useMemo(() => {
    if (!rooms.length) return { cx: 0, cz: 0, span: 10 };
    const minX = Math.min(...rooms.map((r) => r.x));
    const minZ = Math.min(...rooms.map((r) => r.y));
    const maxX = Math.max(...rooms.map((r) => r.x + r.width));
    const maxZ = Math.max(...rooms.map((r) => r.y + r.depth));
    return { cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, span: Math.max(maxX - minX, maxZ - minZ, 6) };
  }, [rooms]);

  const faces = useMemo(() => buildFaces(rooms, plan?.doors || [], height), [rooms, plan, height]);

  const W = 900, H = 460;
  const scale = ((Math.min(W, H) * 0.62) / (bounds.span * 1.25)) * view.zoom;

  const project = ([x, y, z]) => {
    const dx = x - bounds.cx;
    const dz = z - bounds.cz;
    const rx = dx * Math.cos(view.yaw) - dz * Math.sin(view.yaw);
    const rz = dx * Math.sin(view.yaw) + dz * Math.cos(view.yaw);
    return {
      sx: W / 2 + rx * scale,
      sy: H / 2 + (rz * Math.cos(view.pitch) - y * Math.sin(view.pitch)) * scale,
      depth: rz,
    };
  };

  const drawn = faces
    .map((f) => {
      const pts = f.points.map(project);
      return { ...f, pts, order: pts.reduce((s, p) => s + p.depth, 0) / pts.length, isFloor: f.kind === "floor" };
    })
    .sort((a, b) => (a.isFloor === b.isFloor ? a.order - b.order : a.isFloor ? -1 : 1));

  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, ...view };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const start = drag.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    setView((v) => ({
      ...v,
      yaw: start.yaw + dx * 0.008,
      pitch: Math.min(Math.max(start.pitch - dy * 0.006, 0.15), 1.45),
    }));
  };
  const onUp = () => { drag.current = null; };

  return (
    <div className="relative overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-[#FAFAF7]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[460px] w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onWheel={(e) => { e.preventDefault(); setView((v) => ({ ...v, zoom: Math.min(Math.max(v.zoom * (e.deltaY > 0 ? 0.92 : 1.08), 0.4), 3) })); }}
      >
        {drawn.map((f, i) => (
          <polygon
            key={i}
            points={f.pts.map((p) => `${p.sx},${p.sy}`).join(" ")}
            fill={f.fill}
            stroke={f.stroke}
            strokeWidth="1"
            fillOpacity={f.kind === "wall" ? 0.95 : 1}
          />
        ))}
        {rooms.map((r, i) => {
          const c = project([r.x + r.width / 2, 0, r.y + r.depth / 2]);
          return (
            <text key={`l-${i}`} x={c.sx} y={c.sy} textAnchor="middle" fontSize="12" fill="#1F2937" className="font-body">
              {r.name}
            </text>
          );
        })}
      </svg>

      <div className="absolute right-3 top-3 flex items-center gap-2">
        <button
          onClick={() => setView({ yaw: 0.7, pitch: 0.95, zoom: 1 })}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white/90 px-2 text-[11px] font-medium"
        >
          <RotateCw className="h-3 w-3" /> Reset view
        </button>
      </div>
      <div className="absolute left-3 top-3 flex gap-1.5">
        {[["Top", { yaw: 0, pitch: 0.2, zoom: 1 }], ["Side", { yaw: 0, pitch: 1.4, zoom: 1 }], ["Corner", { yaw: 0.7, pitch: 0.95, zoom: 1 }]].map(([label, v]) => (
          <button key={label} onClick={() => setView(v)} className="h-8 rounded-md border border-[#E5E7EB] bg-white/90 px-2 text-[11px] font-medium">
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}