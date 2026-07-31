import React from "react";
import { FileText, Trash2 } from "lucide-react";
import DisciplineIcon from "../DisciplineIcon";
import StatusBadge from "../StatusBadge";
import { fmtTime } from "../clarityApi";
import { cn } from "@/lib/utils";

export default function EvidenceCard({ fact, onDelete, onConfirm }) {
  const missing = fact.classification === "Missing" || fact.classification === "Contradicted";
  return (
    <div className={cn("group rounded-[10px] border bg-white p-3", missing ? "border-[#EF4444] bg-[#FEF2F2]" : "border-[#E5E7EB]")}>
      <div className="flex items-start gap-2.5">
        <DisciplineIcon name={fact.discipline} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-snug text-[#1F2937]">{fact.text}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusBadge>{fact.classification}</StatusBadge>
            <span className="text-[11px] text-[#6B7280]">{fact.source_user || "No confirmed source"}</span>
            <span className="text-[11px] text-[#6B7280]">{fmtTime(fact.source_time)}</span>
          </div>
        </div>
        <FileText className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {fact.classification !== "Confirmed" ? (
            <button onClick={() => onConfirm(fact)} title="Confirm" className="text-[11px] text-[#2563EB] hover:underline">Confirm</button>
          ) : null}
          <button onClick={() => onDelete(fact)} title="Delete">
            <Trash2 className="h-3.5 w-3.5 text-[#6B7280] hover:text-[#EF4444]" />
          </button>
        </div>
      </div>
    </div>
  );
}