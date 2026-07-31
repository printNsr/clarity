import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DrawingCompare from "@/components/clarity/drawings/DrawingCompare";
import DrawingViewer from "@/components/clarity/drawings/DrawingViewer";
import StatusBadge from "@/components/clarity/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { logEvent, fmtDate } from "@/components/clarity/clarityApi";
import { useToast } from "@/components/ui/use-toast";

export default function DrawingUpdatePage() {
  const { drawingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [drawing, setDrawing] = useState(null);
  const [update, setUpdate] = useState(null);
  const [issue, setIssue] = useState(null);
  const [markups, setMarkups] = useState(true);
  const [viewer, setViewer] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const d = await base44.entities.Drawing.get(drawingId);
    const ups = await base44.entities.DrawingUpdate.filter({ drawing_id: drawingId }, "-created_date", 1);
    setDrawing(d);
    setUpdate(ups[0] || null);
    if (ups[0]?.issue_id) setIssue(await base44.entities.ChangeIssue.get(ups[0].issue_id));
  }, [drawingId]);

  useEffect(() => { load(); }, [load]);

  const markUpdated = async () => {
    setBusy(true);
    if (update) await base44.entities.DrawingUpdate.update(update.id, { status: "Updated" });
    await base44.entities.Drawing.update(drawingId, { status: "Updated" });
    if (issue) {
      await base44.entities.ChangeIssue.update(issue.id, { status: "Drawing Updated" });
      await logEvent(issue, "drawing_updated", `Drawing ${drawing.drawing_number} updated`, { description: update?.description, severity: "Info" });
    }
    setBusy(false);
    toast({ title: "Drawing marked as updated" });
    if (issue) navigate(`/changes/${issue.id}/verification`);
    else load();
  };

  if (!drawing) return <p className="text-[12px] text-[#6B7280]">Loading drawing</p>;

  return (
    <div className="space-y-3">
      {issue ? (
        <Link to={`/changes/${issue.id}/resolve`} className="inline-flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#1F2937]">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Resolution
        </Link>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-[13px]">
          {drawing.drawing_number} · {drawing.title}
        </span>
        <label className="flex items-center gap-2 text-[12px]">
          <Checkbox checked={markups} onCheckedChange={(v) => setMarkups(Boolean(v))} /> Show Markups
        </label>
        <StatusBadge className="ml-auto">{drawing.status}</StatusBadge>
      </div>

      <DrawingCompare
        elements={issue?.elements || []}
        zone={issue?.zone}
        showMarkups={markups}
        markupLabel={update?.markup_label || update?.description || "Requested update"}
      />

      <div className="grid gap-3 rounded-[10px] border border-[#E5E7EB] bg-white p-3.5 md:grid-cols-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">Update Details</p>
          <p className="text-[13px]">{update?.description || "No update requested."}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">Owner</p>
          <p className="text-[13px]">{update?.owner || "Unassigned"}</p>
          <p className="text-[11px] text-[#6B7280]">{update?.owner_role}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">Due Date</p>
          <p className="text-[13px]">{fmtDate(update?.due_date) || "Not set"}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">Status</p>
          <StatusBadge>{update?.status || "Requested"}</StatusBadge>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setViewer(true)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-4 text-[12px] font-medium hover:bg-[#F8FAFC]">
          Open in Viewer <ExternalLink className="h-3.5 w-3.5" />
        </button>
        <button onClick={markUpdated} disabled={busy} className="h-9 rounded-md bg-[#2563EB] px-4 text-[12px] font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-60">
          Mark as Updated
        </button>
      </div>

      <DrawingViewer
        open={viewer}
        onOpenChange={setViewer}
        elements={issue?.elements || []}
        zone={issue?.zone}
        markupLabel={update?.markup_label || "Requested update"}
      />
    </div>
  );
}