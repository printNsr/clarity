import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DecisionForm from "@/components/clarity/resolve/DecisionForm";
import ImpactPlan from "@/components/clarity/resolve/ImpactPlan";
import PeopleChips from "@/components/clarity/resolve/PeopleChips";
import { logEvent, nextRfiNumber } from "@/components/clarity/clarityApi";
import { useToast } from "@/components/ui/use-toast";

export default function ResolvePage() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [issue, setIssue] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [facts, setFacts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ resolution: "", reason: "", owner: "", due_date: "", priority: "High", participants: [] });

  const load = useCallback(async () => {
    const [i, as, fs, ds] = await Promise.all([
      base44.entities.ChangeIssue.get(issueId),
      base44.entities.CollisionAnalysis.filter({ issue_id: issueId }, "-created_date", 1),
      base44.entities.EvidenceFact.filter({ issue_id: issueId }, "order"),
      base44.entities.Decision.filter({ issue_id: issueId }, "-created_date", 1),
    ]);
    setIssue(i);
    setAnalysis(as[0] || null);
    setFacts(fs);
    const draft = ds[0];
    setForm({
      resolution: draft?.resolution || "Move cable tray",
      reason: draft?.reason || as[0]?.exact_question || "",
      owner: draft?.owner || i.owner || "",
      due_date: draft?.due_date || i.due_date || "",
      priority: draft?.priority || i.priority || "High",
      participants: draft?.participants || [],
    });
  }, [issueId]);

  useEffect(() => { load(); }, [load]);

  const persist = async (status) => {
    const existing = await base44.entities.Decision.filter({ issue_id: issueId, status: "Draft" }, "-created_date", 1);
    const payload = { ...form, issue_id: issueId, title: form.resolution, status, due_date: form.due_date || undefined };
    if (existing[0]) return base44.entities.Decision.update(existing[0].id, payload);
    return base44.entities.Decision.create(payload);
  };

  const saveDraft = async () => {
    setSaving(true);
    await persist("Draft");
    setSaving(false);
    toast({ title: "Draft saved" });
  };

  const record = async () => {
    if (!form.resolution || !form.reason || !form.owner) {
      toast({ title: "Please complete decision, reason and owner", variant: "destructive" });
      return;
    }
    setSaving(true);
    await persist("Approved");
    await base44.entities.ChangeIssue.update(issueId, { status: "Decision Recorded" });
    await logEvent(issue, "decision_recorded", "Resolution recorded", { description: form.resolution, severity: form.priority });

    const rfiNumber = await nextRfiNumber(issue.project_id);
    const rfi = await base44.entities.RFI.create({
      project_id: issue.project_id,
      issue_id: issue.id,
      rfi_number: rfiNumber,
      title: issue.title,
      question: analysis?.exact_question || form.reason,
      background: analysis?.impact_explanation,
      location: [issue.level, issue.zone].filter(Boolean).join(", "),
      priority: form.priority,
      recipients: form.participants,
      disciplines: issue.disciplines || [],
      related_drawings: issue.related_drawings || [],
      evidence: facts.filter((f) => f.classification !== "Missing").slice(0, 3).map((f) => ({ discipline: f.discipline, text: f.text })),
      due_date: form.due_date || undefined,
      status: "Draft",
    });
    setSaving(false);
    toast({ title: `${rfiNumber} drafted` });
    navigate(`/rfis/${rfi.id}`);
  };

  if (!issue) return <p className="text-[12px] text-[#6B7280]">Loading resolve room</p>;

  return (
    <div className="space-y-3">
      <Link to={`/changes/${issueId}/analysis`} className="inline-flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#1F2937]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Analysis
      </Link>

      <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div>
            <h1 className="text-[16px] font-semibold">What needs to be decided?</h1>
            <div className="mt-2 rounded-[10px] border border-[#2563EB] bg-[#EFF6FF] p-3">
              <p className="text-[13px] font-medium">{form.resolution || "Select a resolution"}</p>
              <p className="text-[12px] text-[#6B7280]">{form.reason}</p>
            </div>
          </div>
          <PeopleChips people={form.participants} onChange={(participants) => setForm({ ...form, participants })} />
          <DecisionForm form={form} onChange={setForm} onRecord={record} onSaveDraft={saveDraft} saving={saving} />
        </div>
        <ImpactPlan elements={issue.elements || []} zone={issue.zone} />
      </div>
    </div>
  );
}