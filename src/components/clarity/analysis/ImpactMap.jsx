import React, { useState } from "react";
import { TriangleAlert } from "lucide-react";

const POSITIONS = [
  { x: 200, y: 30 },
  { x: 60, y: 105 },
  { x: 340, y: 105 },
  { x: 200, y: 180 },
];

export default function ImpactMap({ nodes = [], facts = [] }) {
  const [selected, setSelected] = useState(null);
  const shown = nodes.slice(0, 4);
  const related = selected ? facts.filter((f) => (f.element || "").includes(selected) || f.text?.includes(selected)) : [];

  return (
    <div>
      <h2 className="text-[14px] font-semibold">Impact Overview</h2>
      <div className="mt-2 flex flex-col gap-3 rounded-[10px] border border-[#E5E7EB] bg-white p-3 md:flex-row">
        <svg viewBox="0 0 400 210" className="h-[210px] w-full md:flex-1">
          {shown.map((n, i) => (
            <line key={n} x1={POSITIONS[i].x} y1={POSITIONS[i].y} x2="200" y2="105" stroke="#E5E7EB" strokeWidth="1.5" />
          ))}
          <circle cx="200" cy="105" r="26" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1.5" />
          <text x="200" y="110" textAnchor="middle" fontSize="11" fill="#EF4444">!</text>
          {shown.map((n, i) => (
            <g key={n} className="cursor-pointer" onClick={() => setSelected(n === selected ? null : n)}>
              <rect x={POSITIONS[i].x - 34} y={POSITIONS[i].y - 13} width="68" height="26" rx="13" fill={selected === n ? "#EFF6FF" : "#FFFFFF"} stroke={selected === n ? "#2563EB" : "#E5E7EB"} />
              <text x={POSITIONS[i].x} y={POSITIONS[i].y + 4} textAnchor="middle" fontSize="10" fill="#1F2937">{n}</text>
            </g>
          ))}
        </svg>
        <div className="w-full md:w-56">
          <ul className="space-y-1.5 text-[11px] text-[#6B7280]">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> Inferred</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Stated</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#EF4444]" /> Missing</li>
          </ul>
          {selected ? (
            <div className="mt-3 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-2">
              <p className="text-[11px] font-medium">{selected}</p>
              {related.length ? (
                related.map((f) => <p key={f.id} className="mt-1 text-[11px] text-[#6B7280]">{f.text}</p>)
              ) : (
                <p className="mt-1 text-[11px] text-[#6B7280]">No linked facts.</p>
              )}
            </div>
          ) : (
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-[#6B7280]">
              <TriangleAlert className="mt-0.5 h-3 w-3 text-[#EF4444]" /> Select a node to see its facts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}