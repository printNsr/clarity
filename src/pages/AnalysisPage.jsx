import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, TriangleAlert } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AssumptionCompare from "@/components/clarity/analysis/AssumptionCompare";
import ImpactMap from "@/components/clarity/analysis/ImpactMap";

export default function AnalysisPage() {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [facts, setFacts] = useState([]);
  const [showWhy, setShowWhy] = useState(false);

  const load = useCallback(async () => {
    const [i, as, fs] = await Promise.all([
      base44.entities.ChangeIssue.get(issueId),
      base44.entities.CollisionAnalysis.filter({ issue_id: issueId }, "-created_date", 1),
      base44.entities.EvidenceFact.filter({ issue_id: issueId }, "order"),
    ]);
    setIssue(i);
    setAnalysis(as[0] || null);
    setFacts(fs);
  }, [issueId]);

  useEffect(() => { load(); }, [load]);

  if (!issue) return <p className="text-[12px] text-[#6B7280]">Loading analysis</p>;

  return (
    <div className="space-y-4">
      <Link to={`/changes/${issueId}`} className="inline-flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#1F2937]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Issue
      </Link>

      {!analysis ? (
        <p className="text-[12px] text-[#6B7280]">No analysis has been run for this change yet.</p>
      ) : (
        <>
          <div className={`rounded-[10px] border p-3.5 ${analysis.collision_detected ? "border-[#EF4444] bg-[#FEF2F2]" : "border-[#BBF7D0] bg-[#F0FDF4]"}`}>
            <div className="flex items-start gap-2">
              <TriangleAlert className={`mt-0.5 h-4 w-4 ${analysis.collision_detected ? "text-[#EF4444]" : "text-[#16A34A]"}`} />
              <div>
                <p className="text-[14px] font-semibold">{analysis.collision_detected ? "Potential Meaningful Collision" : "No meaningful collision detected"}</p>
                <p className="text-[12px] text-[#6B7280]">{analysis.summary}</p>
                <p className="mt-1 text-[11px] text-[#6B7280]">{analysis.category} · {analysis.severity} severity</p>
              </div>
            </div>
          </div>

          <AssumptionCompare assumptions={analysis.assumptions || []} />
          <ImpactMap nodes={analysis.nodes || []} facts={facts} />

          <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-3.5">
            <h2 className="text-[14px] font-semibold">Exact Question to Resolve</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <p className="text-[13px] text-[#1F2937]">{analysis.exact_question}</p>
              <button onClick={() => setShowWhy((s) => !s)} className="h-8 rounded-md border border-[#E5E7EB] px-3 text-[11px] hover:bg-[#F8FAFC]">
                Why this matters
              </button>
            </div>
            {showWhy ? <p className="mt-2 rounded-md bg-[#F8FAFC] p-2.5 text-[12px] text-[#6B7280]">{analysis.impact_explanation}</p> : null}
          </div>

          <div className="flex gap-2">
            <Link to={`/changes/${issueId}/evidence`} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2563EB] px-4 text-[12px] font-medium text-white hover:bg-[#1D4ED8]">
              View Evidence <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to={`/changes/${issueId}/resolve`} className="inline-flex h-9 items-center rounded-md border border-[#E5E7EB] bg-white px-4 text-[12px] font-medium hover:bg-[#F8FAFC]">
              Resolve Room
            </Link>
          </div>
        </>
      )}
    </div>
  );
}