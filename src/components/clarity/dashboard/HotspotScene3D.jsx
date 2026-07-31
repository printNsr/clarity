import React, { useMemo, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { PLOT_X, PLOT_Z, WALL_H } from "./houseLayout";
import SvgTooltip from "./SvgTooltip";

const DEFAULT_W = 640, DEFAULT_H = 300;

/** Hand rolled 3D house view. Drag to spin a full 360 degrees, pick a floor, hover a marker for details. */
export default function HotspotScene3D({ spots, rooms, floors, floor, onSelectFloor, onOpen, height = 300, zoom = 1, focus = null, viewW = DEFAULT_W, viewH = DEFAULT_H }) {
  const W = viewW, H = viewH;
  const [view, setView] = useState({ yaw: 0.6, pitch: 0.9 });
  const [hover, setHover] = useState(null);
  const [hoverRoom, setHoverRoom] = useState(null);
  const drag = useRef(null);
  const scale = 5 * zoom;

  const project = ([x, y, z]) => {
    const dx = x - (focus ? focus[0] : PLOT_X / 2);
    const dz = z - (focus ? focus[1] : PLOT_Z / 2);
    const rx = dx * Math.cos(view.yaw) - dz * Math.sin(view.yaw);
    const rz = dx * Math.sin(view.yaw) + dz * Math.cos(view.yaw);
    return {
      sx: W / 2 + rx * scale,
      sy: H / 2 + 20 + (rz * Math.cos(view.pitch) - y * Math.sin(view.pitch)) * scale,
      depth: rz,
    };
  };
  const poly = (pts) => pts.map(project).map((p) => `${p.sx},${p.sy}`).join(" ");

  const faces = useMemo(() => {
    const out = [];
    rooms.forEach((r) => {
      out.push({
        kind: "floor",
        pts: [[r.x, 0, r.z], [r.x + r.w, 0, r.z], [r.x + r.w, 0, r.z + r.d], [r.x, 0, r.z + r.d]],
        room: r,
      });
      const h = WALL_H * 0.55;
      [
        [[r.x, r.z], [r.x + r.w, r.z]],
        [[r.x, r.z + r.d], [r.x + r.w, r.z + r.d]],
        [[r.x, r.z], [r.x, r.z + r.d]],
        [[r.x + r.w, r.z], [r.x + r.w, r.z + r.d]],
      ].forEach(([a, b]) => {
        out.push({
          kind: "wall",
          pts: [[a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], h, b[1]], [a[0], h, a[1]]],
        });
      });
    });
    [
      [[0, 0], [PLOT_X, 0]],
      [[0, PLOT_Z], [PLOT_X, PLOT_Z]],
      [[0, 0], [0, PLOT_Z]],
      [[PLOT_X, 0], [PLOT_X, PLOT_Z]],
    ].forEach(([a, b]) => {
      out.push({
        kind: "shell",
        pts: [[a[0], 0, a[1]], [b[0], 0, b[1]], [b[0], WALL_H, b[1]], [a[0], WALL_H, a[1]]],
      });
    });
    return out;
  }, [rooms]);

  const drawn = faces
    .map((f) => ({ ...f, order: f.pts.map(project).reduce((s, p) => s + p.depth, 0) / f.pts.length }))
    .sort((a, b) => (a.kind === "floor") === (b.kind === "floor") ? a.order - b.order : a.kind === "floor" ? -1 : 1);

  const markers = spots
    .map((s) => ({ ...s, base: project([s.px, 0, s.pz]), top: project([s.px, 3.6, s.pz]) }))
    .sort((a, b) => a.base.depth - b.base.depth);

  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, ...view };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const start = drag.current;
    if (!start) return;
    setView({
      yaw: start.yaw + (e.clientX - start.x) * 0.008,
      pitch: Math.min(Math.max(start.pitch - (e.clientY - start.y) * 0.006, 0.15), 1.4),
    });
  };
  const onUp = () => { drag.current = null; };

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-[#FAFAF7]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ height }}
        className="w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {drawn.map((f, i) => (
          <polygon
            key={i}
            points={poly(f.pts)}
            onMouseEnter={f.kind === "floor" ? () => setHoverRoom(f.room) : undefined}
            onMouseLeave={f.kind === "floor" ? () => setHoverRoom(null) : undefined}
            fill={f.kind === "floor" ? (hoverRoom?.name === f.room?.name ? "#FEF3C7" : "#F1F5F9") : f.kind === "wall" ? "#E2E8F0" : "#DCE3EC"}
            fillOpacity={f.kind === "shell" ? 0.4 : f.kind === "wall" ? 0.85 : 1}
            stroke={f.kind === "floor" ? "#CBD5E1" : "#B8C2CF"}
            strokeWidth="1"
          />
        ))}
        {rooms.map((r) => {
          const c = project([r.x + r.w / 2, 0, r.z + r.d / 2]);
          return (
            <text key={r.name} x={c.sx} y={c.sy} textAnchor="middle" fontSize="9" fill="#6B7280">
              {r.name}
            </text>
          );
        })}

        {markers.map((m) => (
          <g key={m.issue.id} className="cursor-pointer" onMouseEnter={() => setHover(m)} onMouseLeave={() => setHover(null)} onClick={() => onOpen(m.issue)}>
            <line x1={m.base.sx} y1={m.base.sy} x2={m.top.sx} y2={m.top.sy} stroke={m.sev.fill} strokeOpacity="0.5" />
            <ellipse cx={m.base.sx} cy={m.base.sy} rx={m.sev.r} ry={m.sev.r * Math.max(0.15, Math.cos(view.pitch))} fill={m.sev.fill} fillOpacity="0.18" stroke={m.sev.fill} strokeOpacity="0.5" />
            <circle cx={m.top.sx} cy={m.top.sy} r={m.sev.r * 0.5} fill={m.sev.fill} fillOpacity="0.8" />
          </g>
        ))}

        {hover ? (
          <SvgTooltip
            width={W}
            height={H}
            color={hover.sev.fill}
            anchor={hover.top}
            rows={[
              { text: hover.issue.title || "Change", weight: 600, color: "#1F2937" },
              { text: [hover.issue.level, hover.issue.zone].filter(Boolean).join(" · ") || "Location not set" },
              {
                text: `${hover.issue.collision_risk} risk · ${(hover.issue.disciplines || []).join(", ") || "trades not listed"}`,
                color: hover.sev.fill,
              },
              { text: hover.issue.description },
            ]}
          />
        ) : hoverRoom ? (
          <SvgTooltip
            width={W}
            height={H}
            color="#B45309"
            anchor={project([hoverRoom.x + hoverRoom.w / 2, 0, hoverRoom.z + hoverRoom.d / 2])}
            rows={[
              { text: hoverRoom.name, weight: 600, color: "#1F2937" },
              { text: `${hoverRoom.w} m by ${hoverRoom.d} m on ${floor}` },
              { text: roomNote(hoverRoom, spots) },
            ]}
          />
        ) : null}
      </svg>

      <div className="absolute left-3 top-3 flex flex-col gap-1">
        {floors.map((f) => (
          <button
            key={f}
            onClick={() => onSelectFloor(f)}
            className={`h-7 rounded-md border px-2 text-[11px] font-medium ${f === floor ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#E5E7EB] bg-white/90 text-[#6B7280]"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <button
        onClick={() => setView({ yaw: 0.6, pitch: 0.9 })}
        style={{ background: "#FFFFFF", color: "#1F2937" }}
        className="absolute right-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-md border border-[#E5E7EB] px-2 text-[11px] font-medium"
      >
        <RotateCw className="h-3 w-3" /> Reset view
      </button>
      {spots.length === 0 ? (
        <p className="absolute inset-x-0 bottom-2 text-center text-[12px] text-[#6B7280]">No collisions on this floor.</p>
      ) : null}
    </div>
  );
}

function roomNote(room, spots) {
  const inside = spots.filter(
    (s) => s.px >= room.x && s.px <= room.x + room.w && s.pz >= room.z && s.pz <= room.z + room.d
  );
  if (!inside.length) return "No clash recorded in this room.";
  return inside.map((s) => `${s.issue.collision_risk} risk: ${s.issue.title}`).join(". ");
}

function truncate(text, n) {
  const t = text || "Change";
  return t.length > n ? `${t.slice(0, n)}…` : t;
}