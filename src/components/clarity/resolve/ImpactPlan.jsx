import React from "react";
import FloorPlan from "../FloorPlan";

export default function ImpactPlan({ elements = [], zone }) {
  const [a, b, c] = elements;
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-3">
      <h3 className="text-[13px] font-semibold">Impact Map</h3>
      <FloorPlan height={210}>
        <rect x="120" y="55" width="150" height="120" fill="none" stroke="#EF4444" strokeDasharray="5 4" />
        {a ? <text x="200" y="45" textAnchor="middle" fontSize="10" fill="#1F2937">{a}</text> : null}
        {b ? (
          <g>
            <rect x="130" y="100" width="60" height="18" rx="4" fill="#F5F3FF" stroke="#7C3AED" />
            <text x="160" y="112" textAnchor="middle" fontSize="9" fill="#7C3AED">{b}</text>
          </g>
        ) : null}
        {c ? (
          <g>
            <rect x="215" y="100" width="60" height="18" rx="4" fill="#ECFDF5" stroke="#16A36A" />
            <text x="245" y="112" textAnchor="middle" fontSize="9" fill="#16A36A">{c}</text>
          </g>
        ) : null}
        {zone ? <text x="200" y="196" textAnchor="middle" fontSize="10" fill="#6B7280">{zone}</text> : null}
      </FloorPlan>
    </div>
  );
}