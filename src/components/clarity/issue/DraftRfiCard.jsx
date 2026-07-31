import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function DraftRfiCard({ issue }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const draft = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await base44.functions.invoke("draftRfi", { issue_id: issue.id });
      if (res.data?.error) throw new Error(res.data.error);
      navigate(`/rfis/${res.data.rfi_id}`);
    } catch {
      setError("The RFI draft could not be created right now. Please try again.");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2">
        <FileQuestion className="h-4 w-4 text-[#2563EB]" />
        <h2 className="text-[14px] font-semibold">AI RFI Draft</h2>
      </div>
      <p className="mt-1 text-[12px] leading-relaxed text-[#6B7280]">
        Writes a formal RFI from this change's details, evidence and discussion. You review and send it yourself.
      </p>
      {error ? <p className="mt-2 text-[12px] text-[#DC2626]">{error}</p> : null}
      <button
        onClick={draft}
        disabled={busy}
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#2563EB] text-[12px] font-medium text-[#2563EB] hover:bg-[#EFF6FF] disabled:opacity-70"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {busy ? "Writing the draft" : "Draft RFI with AI"}
      </button>
    </div>
  );
}