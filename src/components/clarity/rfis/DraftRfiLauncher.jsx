import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DraftRfiLauncher() {
  const { project } = useClarity();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !project) return;
    base44.entities.ChangeIssue.filter({ project_id: project.id }, "-created_date", 100)
      .then((list) => setIssues(list.filter((i) => !["Closed", "Archived"].includes(i.status))));
  }, [open, project]);

  const draft = async (issue) => {
    setBusyId(issue.id);
    setError("");
    try {
      const res = await base44.functions.invoke("draftRfi", { issue_id: issue.id });
      if (res.data?.error) throw new Error(res.data.error);
      navigate(`/rfis/${res.data.rfi_id}`);
    } catch {
      setError("The RFI draft could not be created right now. Please try again.");
      setBusyId(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-[#7C3AED] px-3 text-[12px] font-medium text-[#7C3AED] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7C3AED] hover:text-white hover:shadow-md hover:shadow-[#7C3AED]/30"
      >
        <Sparkles className="h-3.5 w-3.5" /> Draft RFI with AI
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[15px]">Which change is this RFI about?</DialogTitle>
          </DialogHeader>
          <p className="text-[12px] text-[#6B7280]">
            The AI writes a formal RFI from the change's details, evidence and discussion. You review and send it yourself.
          </p>
          {error ? <p className="text-[12px] text-[#DC2626]">{error}</p> : null}
          <div className="max-h-72 divide-y divide-[#F1F5F9] overflow-y-auto rounded-md border border-[#E5E7EB]">
            {issues.length === 0 ? (
              <p className="p-4 text-center text-[12px] text-[#6B7280]">No open changes in this project.</p>
            ) : (
              issues.map((i) => (
                <button
                  key={i.id}
                  onClick={() => draft(i)}
                  disabled={!!busyId}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-[#F8FAFC] disabled:opacity-60"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px]">{i.title}</span>
                  <span className="text-[11px] text-[#6B7280]">{[i.level, i.zone].filter(Boolean).join(", ")}</span>
                  {busyId === i.id ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#7C3AED]" /> : null}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}