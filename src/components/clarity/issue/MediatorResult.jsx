import React from "react";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";

const CONF = { High: "text-[#16A34A]", Medium: "text-[#D97706]", Low: "text-[#DC2626]" };

export default function MediatorResult({ result }) {
  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#B45309]">AI draft</span>
        <span className={`text-[11px] font-medium ${CONF[result.confidence] || CONF.Medium}`}>Confidence: {result.confidence}</span>
      </div>
      <p className="text-[12px] leading-relaxed text-[#1F2937]">{result.summary}</p>

      {result.positions?.length ? (
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">Each side's view</p>
          {result.positions.map((p, i) => (
            <div key={i} className="flex items-start gap-2 rounded-md border border-[#E5E7EB] p-2">
              <DisciplineIcon name={p.discipline} size="sm" />
              <p className="text-[12px] leading-relaxed"><span className="font-medium">{p.discipline}:</span> {p.position}</p>
            </div>
          ))}
        </div>
      ) : null}

      {result.solutions?.length ? (
        <div className="space-y-1.5">
          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">Suggested ways forward</p>
          {result.solutions.map((s, i) => (
            <div key={i} className="rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-2.5">
              <p className="text-[12px] font-semibold">{s.title}</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[#6B7280]">{s.description}</p>
              {s.tradeoff ? <p className="mt-1 text-[11px] text-[#B45309]">Tradeoff: {s.tradeoff}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      <p className="text-[11px] text-[#6B7280]">Based on the discussion and evidence recorded on this change. Review before acting on it.</p>
    </div>
  );
}