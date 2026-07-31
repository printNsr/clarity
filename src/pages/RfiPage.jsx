import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";
import StatusBadge from "@/components/clarity/StatusBadge";
import { logEvent } from "@/components/clarity/clarityApi";
import { useToast } from "@/components/ui/use-toast";

export default function RfiPage() {
  const { rfiId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rfi, setRfi] = useState(null);
  const [question, setQuestion] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const r = await base44.entities.RFI.get(rfiId);
    setRfi(r);
    setQuestion(r.question || "");
  }, [rfiId]);

  useEffect(() => { load(); }, [load]);

  const saveDraft = async () => {
    setBusy(true);
    await base44.entities.RFI.update(rfiId, { question, status: "Draft" });
    setBusy(false);
    toast({ title: "RFI draft saved" });
    load();
  };

  const send = async () => {
    setBusy(true);
    await base44.entities.RFI.update(rfiId, { question, status: "Sent", sent_at: new Date().toISOString() });
    const issue = rfi.issue_id ? await base44.entities.ChangeIssue.get(rfi.issue_id) : null;
    if (issue) {
      await base44.entities.ChangeIssue.update(issue.id, { status: "RFI Sent" });
      await logEvent(issue, "rfi_sent", `${rfi.rfi_number} sent`, { description: rfi.title, severity: "RFI" });
    }
    setBusy(false);
    setConfirming(false);
    toast({ title: `${rfi.rfi_number} sent` });

    const number = (rfi.related_drawings || [])[0];
    if (number && issue) {
      const drawings = await base44.entities.Drawing.filter({ project_id: issue.project_id, drawing_number: number }, "-created_date", 1);
      const drawing = drawings[0];
      if (drawing) {
        const existing = await base44.entities.DrawingUpdate.filter({ drawing_id: drawing.id, issue_id: issue.id }, "-created_date", 1);
        if (!existing[0]) {
          await base44.entities.DrawingUpdate.create({
            drawing_id: drawing.id,
            issue_id: issue.id,
            description: `Update required following ${rfi.rfi_number}.`,
            markup_label: rfi.title,
            owner: rfi.recipients?.[0] || issue.owner,
            due_date: rfi.due_date,
            status: "In Progress",
          });
          await base44.entities.Drawing.update(drawing.id, { status: "Update Requested" });
        }
        navigate(`/drawings/${drawing.id}/update`);
        return;
      }
    }
    load();
  };

  if (!rfi) return <p className="text-[12px] text-[#6B7280]">Loading RFI</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
        <h1 className="text-[14px] font-semibold">RFI Preview</h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-md bg-[#EFF6FF] px-2 py-1 text-[13px] font-semibold text-[#2563EB]">{rfi.rfi_number}</span>
          <StatusBadge>{rfi.status}</StatusBadge>
          <span className="ml-auto text-[12px] font-medium text-[#EF4444]">{rfi.priority} Priority</span>
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-wide text-[#6B7280]">Question</p>
        <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-1 text-[13px]" />

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">Affected Location</p>
            <p className="text-[13px]">{rfi.location || "Not set"}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">Related Drawings</p>
            <p className="text-[13px]">{(rfi.related_drawings || []).join(", ") || "None"}</p>
          </div>
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-wide text-[#6B7280]">Involved Disciplines</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {(rfi.disciplines || []).map((d) => (
            <span key={d} className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] px-2 py-1 text-[12px]">
              <DisciplineIcon name={d} size="sm" /> {d}
            </span>
          ))}
        </div>

        <p className="mt-3 text-[11px] uppercase tracking-wide text-[#6B7280]">Attached Evidence</p>
        <div className="mt-1 grid gap-2 md:grid-cols-3">
          {(rfi.evidence || []).map((e, i) => (
            <div key={i} className="rounded-[10px] border border-[#E5E7EB] p-2.5">
              <DisciplineIcon name={e.discipline} size="sm" />
              <svg viewBox="0 0 120 50" className="mt-1.5 w-full">
                <polygon points="15,35 60,15 105,28 60,48" fill="#F8FAFC" stroke="#CBD5E1" />
                <rect x="30" y="22" width="55" height="5" transform="rotate(-14 30 22)" fill="#94A3B8" />
              </svg>
              <p className="mt-1 text-[11px] text-[#6B7280]">{e.text}</p>
            </div>
          ))}
          {(rfi.evidence || []).length === 0 ? <p className="text-[12px] text-[#6B7280]">No evidence attached.</p> : null}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={saveDraft} disabled={busy} className="h-9 rounded-md border border-[#E5E7EB] px-4 text-[12px] font-medium hover:bg-[#F8FAFC] disabled:opacity-60">Save Draft</button>
          <button onClick={() => setConfirming(true)} disabled={busy} className="h-9 rounded-md bg-[#2563EB] px-4 text-[12px] font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-60">Send RFI</button>
        </div>
      </div>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-[15px]">Send {rfi.rfi_number}?</DialogTitle></DialogHeader>
          <p className="text-[12px] text-[#6B7280]">Send {rfi.rfi_number} to the selected project participants?</p>
          <ul className="mt-1 space-y-1 text-[12px]">
            {(rfi.recipients || []).map((r) => <li key={r}>{r}</li>)}
            {(rfi.recipients || []).length === 0 ? <li className="text-[#6B7280]">No recipients selected.</li> : null}
          </ul>
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setConfirming(false)} className="h-9 rounded-md border border-[#E5E7EB] px-4 text-[12px]">Cancel</button>
            <button onClick={send} disabled={busy} className="h-9 rounded-md bg-[#2563EB] px-4 text-[12px] text-white disabled:opacity-60">Confirm and send</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}