import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import IssueMeta from "@/components/clarity/issue/IssueMeta";
import DiscussionPanel from "@/components/clarity/issue/DiscussionPanel";
import InsightCard from "@/components/clarity/issue/InsightCard";
import StatusBadge from "@/components/clarity/StatusBadge";
import { runAnalysis } from "@/components/clarity/runAnalysis";

export default function ChangeIssuePage() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [messages, setMessages] = useState([]);
  const [facts, setFacts] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const load = useCallback(async () => {
    const [i, ms, fs, as] = await Promise.all([
      base44.entities.ChangeIssue.get(issueId),
      base44.entities.DiscussionMessage.filter({ issue_id: issueId }, "created_date"),
      base44.entities.EvidenceFact.filter({ issue_id: issueId }, "order"),
      base44.entities.CollisionAnalysis.filter({ issue_id: issueId }, "-created_date", 1),
    ]);
    setIssue(i);
    setMessages(ms);
    setFacts(fs);
    setAnalysis(as[0] || null);
  }, [issueId]);

  useEffect(() => { load(); }, [load]);

  const analyze = async () => {
    setAnalyzing(true);
    await runAnalysis(issue, messages, facts);
    setAnalyzing(false);
    navigate(`/changes/${issueId}/analysis`);
  };

  if (!issue) return <p className="text-[12px] text-[#6B7280]">Loading change</p>;

  return (
    <div className="space-y-3">
      <Link to="/changes" className="inline-flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#1F2937]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Changes
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-[24px] font-semibold">{issue.title}</h1>
        <StatusBadge>{issue.status}</StatusBadge>
      </div>

      <div className="grid gap-3 lg:grid-cols-[240px_1fr_300px]">
        <IssueMeta issue={issue} />
        <DiscussionPanel issue={issue} messages={messages} onChange={load} />
        <InsightCard
          summary={analysis?.summary || issue.description || "Run an analysis to compare assumptions across disciplines."}
          onAnalyze={analyze}
          analyzing={analyzing}
          statusText="Comparing assumptions across disciplines"
        />
      </div>
    </div>
  );
}