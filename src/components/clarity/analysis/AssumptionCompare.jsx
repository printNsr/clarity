import React from "react";
import DisciplineIcon from "../DisciplineIcon";
import StatusBadge from "../StatusBadge";
import { disc } from "../disciplines";

function AssumptionCard({ a }) {
  const d = disc(a.discipline);
  return (
    <div className="flex-1 rounded-[10px] border border-[#E5E7EB] bg-white p-3.5">
      <div className="flex items-center gap-2">
        <DisciplineIcon name={a.discipline} size="sm" />
        <span className="text-[12px] font-medium">{a.discipline}</span>
        <StatusBadge className="ml-auto">{a.classification}</StatusBadge>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-[#1F2937]">{a.text}</p>
      <svg viewBox="0 0 240 110" className="mt-3 w-full">
        <polygon points="30,70 130,30 210,55 110,95" fill="#F8FAFC" stroke="#CBD5E1" />
        <rect x="55" y="45" width="110" height="9" transform="rotate(-22 55 45)" fill={d.hex} opacity="0.85" />
      </svg>
    </div>
  );
}

export default function AssumptionCompare({ assumptions = [] }) {
  if (assumptions.length === 0) return null;
  return (
    <div>
      <h2 className="text-[14px] font-semibold">Assumption Comparison</h2>
      <div className="mt-2 flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        <AssumptionCard a={assumptions[0]} />
        <span className="mx-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[11px] font-semibold text-[#6B7280]">
          VS
        </span>
        {assumptions[1] ? <AssumptionCard a={assumptions[1]} /> : <div className="flex-1" />}
      </div>
    </div>
  );
}