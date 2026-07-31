import React from "react";
import { Lightbulb, Loader2 } from "lucide-react";
import IssueScene3D from "./IssueScene3D";

export default function InsightCard({ summary, onAnalyze, analyzing, statusText, issue }) {
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
        <h2 className="text-[14px] font-semibold">Clarity Insight</h2>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-[#6B7280]">{summary}</p>

      {issue ? (
        <div className="mt-3">
          <IssueScene3D issue={issue} />
          <p className="mt-1 text-[11px] leading-relaxed text-[#6B7280]">
            Drag to spin the floor all the way around. Hover a room or the marker to read what is happening there.
          </p>
        </div>
      ) : null}

      <button
        onClick={onAnalyze}
        disabled={analyzing}
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md bg-[#7C3AED] text-[12px] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-md hover:shadow-[#7C3AED]/30 disabled:opacity-70"
      >
        {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {analyzing ? statusText : "Analyze Alignment"}
      </button>
    </div>
  );
}