import React from "react";
import FloorPlan from "../FloorPlan";

function Plan({ elements, zone, markup, markupLabel }) {
  const [a, b, c] = elements;
  return (
    <FloorPlan height={230}>
      {a ? <text x="200" y="42" textAnchor="middle" fontSize="10" fill="#1F2937">{a}</text> : null}
      {b ? (
        <g>
          <rect x={markup ? 175 : 130} y="100" width="60" height="18" rx="3" fill={markup ? "#FEF2F2" : "#F5F3FF"} stroke={markup ? "#EF4444" : "#7C3AED"} strokeDasharray={markup ? "4 3" : undefined} />
          <text x={markup ? 205 : 160} y="112" textAnchor="middle" fontSize="9" fill={markup ? "#EF4444" : "#7C3AED"}>{b}</text>
        </g>
      ) : null}
      {c ? (
        <g>
          <rect x="270" y="100" width="60" height="18" rx="3" fill="#ECFDF5" stroke="#16A36A" />
          <text x="300" y="112" textAnchor="middle" fontSize="9" fill="#16A36A">{c}</text>
        </g>
      ) : null}
      {markup ? (
        <g>
          <rect x="140" y="80" width="200" height="70" fill="none" stroke="#EF4444" strokeDasharray="5 4" />
          <text x="240" y="72" textAnchor="middle" fontSize="9" fill="#EF4444">{markupLabel}</text>
        </g>
      ) : null}
      {zone ? <text x="200" y="200" textAnchor="middle" fontSize="10" fill="#6B7280">{zone}</text> : null}
    </FloorPlan>
  );
}

export default function DrawingCompare({ elements = [], zone, showMarkups, markupLabel }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-3">
        <p className="text-[12px] font-medium">Current (Issued)</p>
        <Plan elements={elements} zone={zone} />
      </div>
      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-3">
        <p className="text-[12px] font-medium">Requested Update (Markup)</p>
        <Plan elements={elements} zone={zone} markup={showMarkups} markupLabel={markupLabel} />
      </div>
    </div>
  );
}

export { Plan };