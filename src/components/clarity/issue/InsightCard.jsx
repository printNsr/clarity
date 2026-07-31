import React from "react";
import { Lightbulb, Loader2 } from "lucide-react";

export default function InsightCard({ summary, onAnalyze, analyzing, statusText }) {
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
        <h2 className="text-[14px] font-semibold">Clarity Insight</h2>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-[#6B7280]">{summary}</p>

      <svg viewBox="0 0 240 140" className="mt-3 w-full">
        <polygon points="30,90 130,40 210,70 110,120" fill="#F1F5F9" stroke="#CBD5E1" />
        <polygon points="30,90 30,60 130,10 130,40" fill="#E2E8F0" stroke="#CBD5E1" />
        <rect x="60" y="55" width="90" height="10" transform="rotate(-24 60 55)" fill="#7C3AED" opacity="0.85" />
        <rect x="95" y="82" width="95" height="14" transform="rotate(-20 95 82)" fill="#94A3B8" opacity="0.9" />
        <rect x="112" y="66" width="26" height="20" transform="rotate(-22 112 66)" fill="#EF4444" opacity="0.75" />
      </svg>
      <p className="text-center text-[11px] text-[#EF4444]">300mm overlap</p>

      <button
        onClick={onAnalyze}
        disabled={analyzing}
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] text-[12px] font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-70"
      >
        {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {analyzing ? statusText : "Analyze Alignment"}
      </button>
    </div>
  );
}