import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import IssueMeta from "@/components/clarity/issue/IssueMeta";
import DiscussionPanel from "@/components/clarity/issue/DiscussionPanel";
import StatusBadge from "@/components/clarity/StatusBadge";
import CollisionViewer3D from "@/components/clarity/CollisionViewer3D";

export default function DesignChangeIssuePage() {
  const { issueId } = useParams();
  const { project } = useClarity();
  const [issue, setIssue] = useState(null);
  const [messages, setMessages] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const load = useCallback(async () => {
    let current = null;
    if (issueId) {
      current = await base44.entities.ChangeIssue.get(issueId);
    } else if (project) {
      const list = await base44.entities.ChangeIssue.filter({ project_id: project.id }, "-created_date", 20);
      current = list.find((i) => i.collision_risk && i.collision_risk !== "None") || list[0] || null;
    }
    setIssue(current);
    if (!current) return;
    const [ms, as] = await Promise.all([
      base44.entities.DiscussionMessage.filter({ issue_id: current.id }, "created_date"),
      base44.entities.CollisionAnalysis.filter({ issue_id: current.id }, "-created_date", 1),
    ]);
    setMessages(ms);
    setAnalysis(as[0] || null);
  }, [issueId, project]);

  useEffect(() => { load(); }, [load]);

  if (!issue) return <p className="text-[12px] text-[#6B7280]">No design change to show yet.</p>;

  return (
    <div className="space-y-3">
      <Link to="/changes" className="inline-flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#1F2937]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Changes
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[24px] font-semibold tracking-tight">{issue.title}</h1>
        <StatusBadge>{issue.status}</StatusBadge>
      </div>

      <div className="grid gap-3 lg:grid-cols-[240px_1fr_320px]">
        <IssueMeta issue={issue} />
        <DiscussionPanel issue={issue} messages={messages} onChange={load} />

        <div className="space-y-3 rounded-[10px] border border-[#E5E7EB] bg-[#F8FAFC] p-3">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
            <span className="text-[14px] font-semibold">Clarity</span>
            <span className="text-[12px] text-[#6B7280]">Insight</span>
          </div>
          <p className="text-[12px] leading-relaxed text-[#1F2937]">
            {analysis?.summary || issue.description || "Hidden collision between two building elements in this zone."}
          </p>

          <CollisionViewer3D
            elementA="AHU duct"
            elementB="Cable tray"
            overlapDistance="300mm"
            overlapLabel="Hidden collision between cable tray and AHU duct"
          />

          <Link
            to={`/changes/${issue.id}/analysis`}
            className="block rounded-md bg-[#2563EB] py-2 text-center text-[12px] font-medium text-white"
          >
            Analyze Alignment
          </Link>
        </div>
      </div>
    </div>
  );
}