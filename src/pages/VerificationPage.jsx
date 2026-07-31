import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircleCheck, ChevronDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import WorkflowTimeline from "@/components/clarity/verification/WorkflowTimeline";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { logEvent, fmtTime } from "@/components/clarity/clarityApi";
import { runAnalysis } from "@/components/clarity/runAnalysis";
import { useToast } from "@/components/ui/use-toast";

const REOPEN = ["Reopen as High Priority", "Request new evidence", "Assign to Project Engineer", "Escalate to Design Manager"];

export default function VerificationPage() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [issue, setIssue] = useState(null);
  const [events, setEvents] = useState([]);
  const [runs, setRuns] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [i, evs, rs] = await Promise.all([
      base44.entities.ChangeIssue.get(issueId),
      base44.entities.WorkflowEvent.filter({ issue_id: issueId }, "occurred_at"),
      base44.entities.VerificationRun.filter({ issue_id: issueId }, "-ran_at"),
    ]);
    setIssue(i);
    setEvents(evs);
    setRuns(rs);
  }, [issueId]);

  useEffect(() => { load(); }, [load]);

  const latest = runs[0];

  const verify = async () => {
    setBusy(true);
    const facts = await base44.entities.EvidenceFact.filter({ issue_id: issueId });
    const missing = facts.filter((f) => f.classification === "Missing" || f.classification === "Contradicted");
    const status = missing.length ? "Invalidated" : "Verified";
    await base44.entities.VerificationRun.create({
      issue_id: issueId,
      status,
      summary: missing.length ? "New evidence contradicts the decision. Reanalysis required." : "Alignment confirmed",
      trigger: "Manual run",
      ran_at: new Date().toISOString(),
    });
    await base44.entities.ChangeIssue.update(issueId, { status: status === "Verified" ? "Verified" : "Invalidated" });
    await logEvent(issue, status === "Verified" ? "verified" : "invalidated", status === "Verified" ? "Verified" : "Resolution invalidated", {
      description: status === "Verified" ? "Alignment confirmed" : "New evidence contradicts the decision.",
      severity: status === "Verified" ? "Resolved" : "High",
    });
    setBusy(false);
    load();
  };

  const reanalyze = async () => {
    setBusy(true);
    const [messages, facts] = await Promise.all([
      base44.entities.DiscussionMessage.filter({ issue_id: issueId }, "created_date"),
      base44.entities.EvidenceFact.filter({ issue_id: issueId }, "order"),
    ]);
    await logEvent(issue, "reanalysis", "Reanalysis started", { severity: "Medium" });
    await runAnalysis(issue, messages, facts);
    setBusy(false);
    navigate(`/changes/${issueId}/analysis`);
  };

  const reopen = async (option) => {
    await base44.entities.ChangeIssue.update(issueId, { status: "Open", priority: option.includes("High") ? "High" : issue.priority });
    await logEvent(issue, "change_created", option, { description: "Issue reopened", severity: "High" });
    toast({ title: option });
    load();
  };

  const toggleMonitoring = async (v) => {
    await base44.entities.ChangeIssue.update(issueId, { auto_monitoring: v });
    load();
  };

  if (!issue) return <p className="text-[12px] text-[#6B7280]">Loading verification</p>;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
        <WorkflowTimeline events={events} />
        <Popover>
          <PopoverTrigger className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E5E7EB] px-3 text-[12px] hover:bg-[#F8FAFC]">
            Reopen Issue <ChevronDown className="h-3.5 w-3.5" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-60 p-1">
            {REOPEN.map((o) => (
              <button key={o} onClick={() => reopen(o)} className="block w-full rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-[#F8FAFC]">{o}</button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4 text-center">
          <p className="text-[13px] font-semibold">Verification</p>
          <CircleCheck className={`mx-auto mt-2 h-12 w-12 ${latest?.status === "Verified" ? "text-[#16A34A]" : "text-[#CBD5E1]"}`} />
          <p className="mt-2 text-[14px] font-semibold">{latest?.status || "Pending"}</p>
          <p className="text-[12px] text-[#6B7280]">{latest?.summary || "No verification run yet."}</p>
          <div className="mt-3 flex gap-2">
            <button onClick={verify} disabled={busy} className="h-9 flex-1 rounded-md bg-[#2563EB] text-[12px] font-medium text-white disabled:opacity-60">Run Verification</button>
            <button onClick={() => navigate(`/changes/${issueId}/analysis`)} className="h-9 flex-1 rounded-md border border-[#E5E7EB] text-[12px] font-medium hover:bg-[#F8FAFC]">View Analysis</button>
          </div>
        </div>

        <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
          <p className="text-[13px] font-semibold">Reanalysis Check</p>
          <p className="mt-1 text-[12px] text-[#6B7280]">Last run: {latest ? fmtTime(latest.ran_at) : "Never"}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[12px]">Auto monitoring</span>
            <Switch checked={issue.auto_monitoring !== false} onCheckedChange={toggleMonitoring} />
          </div>
          {runs.length > 1 ? (
            <ul className="mt-3 space-y-1 text-[11px] text-[#6B7280]">
              {runs.slice(1, 4).map((r) => <li key={r.id}>{r.status} · {fmtTime(r.ran_at)} · {r.trigger}</li>)}
            </ul>
          ) : null}
        </div>

        {latest?.status === "Invalidated" ? (
          <div className="rounded-[10px] border border-[#EF4444] bg-[#FEF2F2] p-4">
            <p className="text-[13px] font-semibold text-[#EF4444]">Resolution Invalidated</p>
            <p className="mt-1 text-[12px] text-[#6B7280]">{latest.summary}</p>
            <button onClick={reanalyze} disabled={busy} className="mt-3 h-9 w-full rounded-md bg-[#EF4444] text-[12px] font-medium text-white disabled:opacity-60">
              {busy ? "Reanalyzing" : "Reanalyze Now"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}