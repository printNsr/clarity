import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import RippleCard from "../RippleCard";

export default function MetricCards({ metrics, onSelect, active }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map((m) => (
        <RippleCard
          key={m.key}
          className={cn(
            "rounded-[10px] border bg-white p-3.5",
            active === m.key ? "border-[#2563EB]" : "border-[#E5E7EB] hover:border-[#FACC15]"
          )}
        >
          <p className="text-[12px] text-[#6B7280]">{m.label}</p>
          <p className={cn("mt-1 text-[30px] font-semibold leading-none", m.color)}>{m.value}</p>
          <button onClick={() => onSelect(m.key)} className="mt-3 inline-flex items-center gap-1 text-[12px] text-[#2563EB] hover:underline">
            View <ArrowRight className="h-3 w-3" />
          </button>
        </RippleCard>
      ))}
    </div>
  );
}