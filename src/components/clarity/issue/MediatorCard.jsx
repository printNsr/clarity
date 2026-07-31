import React, { useState } from "react";
import { Scale, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MediatorResult from "./MediatorResult";

export default function MediatorCard({ issue }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await base44.functions.invoke("mediateConflict", { issue_id: issue.id });
      if (res.data?.error) throw new Error(res.data.error);
      setResult(res.data);
    } catch {
      setError("The mediator could not run right now. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2">
        <Scale className="h-4 w-4 text-[#7C3AED]" />
        <h2 className="text-[14px] font-semibold">Conflict Mediator</h2>
      </div>
      <p className="mt-1 text-[12px] leading-relaxed text-[#6B7280]">
        Reads what each trade has said, sums up the disagreement and suggests balanced ways forward.
      </p>
      {result ? <MediatorResult result={result} /> : null}
      {error ? <p className="mt-2 text-[12px] text-[#DC2626]">{error}</p> : null}
      <button
        onClick={run}
        disabled={busy}
        className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[#7C3AED] text-[12px] font-medium text-[#7C3AED] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7C3AED] hover:text-white hover:shadow-md hover:shadow-[#7C3AED]/30 disabled:opacity-70"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {busy ? "Reading the discussion" : result ? "Run mediator again" : "Run mediator"}
      </button>
    </div>
  );
}