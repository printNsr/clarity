import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import PlanUpload from "@/components/clarity/analyzer/PlanUpload";
import PlanModel3D from "@/components/clarity/analyzer/PlanModel3D";
import PlanSummary from "@/components/clarity/analyzer/PlanSummary";

export default function PlanAnalyzerPage() {
  const [plan, setPlan] = useState(null);

  return (
    <div className="space-y-4">
      <Link to="/drawings" className="inline-flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to drawings
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Plan Analyzer</h1>
          <p className="text-[12px] text-[#6B7280]">
            Upload a photo or PDF of a hand drawn plan. We read the text and rooms and build a 3D model you can spin around.
          </p>
        </div>
        {plan && (
          <button onClick={() => setPlan(null)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-3 text-[12px] font-medium">
            <RotateCcw className="h-3.5 w-3.5" /> Scan another plan
          </button>
        )}
      </div>

      {!plan ? (
        <PlanUpload onResult={setPlan} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-medium">{plan.plan_name || plan.source_name}</p>
              <p className="text-[11px] text-[#6B7280]">Drag to spin all the way around, scroll to zoom.</p>
            </div>
            <PlanModel3D plan={plan} />
            <p className="text-[11px] text-[#6B7280]">
              This model is a draft read from the drawing. {plan.scale_note ? `Scale note: ${plan.scale_note}.` : ""} Check it against the original sheet before you use it.
            </p>
          </div>
          <PlanSummary plan={plan} />
        </div>
      )}
    </div>
  );
}