import React, { useRef, useState } from "react";
import { RotateCw } from "lucide-react";

const W = 640, H = 260;
const SIZE_X = 40, SIZE_Z = 24, WALL_H = 6;

/** Small hand rolled 3D view: points are projected to the SVG with a yaw and tilt you can drag. */
export default function HotspotScene3D({ spots, onOpen }) {
  const [view, setView] = useState({ yaw: 0.6, pitch: 0.9 });
  const [hover, setHover] = useState(null);
  const drag = useRef(null);

  const scale = 5.2;
  const project = ([x, y, z]) => {
    const dx = x - SIZE_X / 2;
    const dz = z - SIZE_Z / 2;
    const rx = dx * Math.cos(view.yaw) - dz * Math.sin(view.yaw);
    const rz = dx * Math.sin(view.yaw) + dz * Math.cos(view.yaw);
    return {
      sx: W / 2 + rx * scale,
      sy: H / 2 + (rz * Math.cos(view.pitch) - y * Math.sin(view.pitch)) * scale,
      depth: rz,
    };
  };
  const poly = (pts) => pts.map(project).map((p) => `${p.sx},${p.sy}`).join(" ");

  const onDown = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, ...view };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const start = drag.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    setView({
      yaw: start.yaw + dx * 0.008,
      pitch: Math.min(Math.max(start.pitch - dy * 0.006, 0.15), 1.4),
    });
  };
  const onUp = () => { drag.current = null; };

  const walls = [
    [[0, 0, 0], [SIZE_X, 0, 0], [SIZE_X, WALL_H, 0], [0, WALL_H, 0]],
    [[0, 0, SIZE_Z], [SIZE_X, 0, SIZE_Z], [SIZE_X, WALL_H, SIZE_Z], [0, WALL_H, SIZE_Z]],
    [[0, 0, 0], [0, 0, SIZE_Z], [0, WALL_H, SIZE_Z], [0, WALL_H, 0]],
    [[SIZE_X, 0, 0], [SIZE_X, 0, SIZE_Z], [SIZE_X, WALL_H, SIZE_Z], [SIZE_X, WALL_H, 0]],
  ]
    .map((pts) => ({ pts, order: pts.map(project).reduce((s, p) => s + p.depth, 0) / 4 }))
    .sort((a, b) => a.order - b.order);

  const markers = spots
    .map((s) => ({ ...s, base: project([s.px, 0, s.pz]), top: project([s.px, 3.4, s.pz]) }))
    .sort((a, b) => a.base.depth - b.base.depth);

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-[#FAFAF7]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[260px] w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <polygon points={poly([[0, 0, 0], [SIZE_X, 0, 0], [SIZE_X, 0, SIZE_Z], [0, 0, SIZE_Z]])} fill="#F1F5F9" stroke="#CBD5E1" />
        {Array.from({ length: 7 }, (_, i) => {
          const gx = (SIZE_X / 8) * (i + 1);
          const a = project([gx, 0, 0]), b = project([gx, 0, SIZE_Z]);
          return <line key={`gx${i}`} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke="#E2E8F0" />;
        })}
        {Array.from({ length: 4 }, (_, i) => {
          const gz = (SIZE_Z / 5) * (i + 1);
          const a = project([0, 0, gz]), b = project([SIZE_X, 0, gz]);
          return <line key={`gz${i}`} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke="#E2E8F0" />;
        })}
        {walls.map((w, i) => (
          <polygon key={`w${i}`} points={poly(w.pts)} fill="#E2E8F0" fillOpacity="0.55" stroke="#B8C2CF" />
        ))}

        {markers.map((m) => (
          <g key={m.issue.id} className="cursor-pointer" onMouseEnter={() => setHover(m)} onMouseLeave={() => setHover(null)} onClick={() => onOpen(m.issue)}>
            <line x1={m.base.sx} y1={m.base.sy} x2={m.top.sx} y2={m.top.sy} stroke={m.sev.fill} strokeOpacity="0.5" />
            <ellipse cx={m.base.sx} cy={m.base.sy} rx={m.sev.r} ry={m.sev.r * Math.max(0.15, Math.cos(view.pitch))} fill={m.sev.fill} fillOpacity="0.18" stroke={m.sev.fill} strokeOpacity="0.5" />
            <circle cx={m.top.sx} cy={m.top.sy} r={m.sev.r * 0.5} fill={m.sev.fill} fillOpacity="0.75" />
          </g>
        ))}
      </svg>

      {hover ? (
        <div className="pointer-events-none absolute left-3 bottom-3 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-[11px] shadow-sm">
          <p className="font-medium">{[hover.issue.level, hover.issue.zone].filter(Boolean).join(", ") || hover.issue.title}</p>
          <p className="text-[#6B7280]">1 conflict · {hover.issue.collision_risk} severity</p>
        </div>
      ) : null}

      <button
        onClick={() => setView({ yaw: 0.6, pitch: 0.9 })}
        className="absolute right-3 top-3 inline-flex h-7 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white/90 px-2 text-[11px] font-medium"
      >
        <RotateCw className="h-3 w-3" /> Reset view
      </button>
      {spots.length === 0 ? (
        <p className="absolute inset-x-0 bottom-2 text-center text-[12px] text-[#6B7280]">No collisions detected yet.</p>
      ) : null}
    </div>
  );
}