import React from "react";
import { Check, Trash2 } from "lucide-react";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";
import StatusBadge from "@/components/clarity/StatusBadge";
import { fmtTime } from "@/components/clarity/clarityApi";
import { cn } from "@/lib/utils";

export default function TradeUpdateItem({ update, onAcknowledge, onDelete }) {
  return (
    <div className={cn("flex gap-3 border-b border-[#F1F5F9] px-4 py-3 last:border-0", !update.acknowledged && "bg-[#F8FAFC]")}>
      <DisciplineIcon name={update.discipline} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-medium">{update.title}</p>
          <StatusBadge>{update.kind}</StatusBadge>
          {update.urgency === "High" ? <StatusBadge>High</StatusBadge> : null}
          {!update.acknowledged ? <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" /> : null}
        </div>
        {update.body ? <p className="mt-1 text-[12px] text-[#6B7280]">{update.body}</p> : null}
        <p className="mt-1 text-[11px] text-[#6B7280]">
          {update.rep_name}{update.company ? ` · ${update.company}` : ""} · {fmtTime(update.posted_at || update.created_date)}
        </p>
      </div>
      <div className="flex items-start gap-2">
        {!update.acknowledged ? (
          <button onClick={() => onAcknowledge(update)} title="Acknowledge" className="text-[#6B7280] hover:text-[#16A34A]">
            <Check className="h-4 w-4" />
          </button>
        ) : null}
        <button onClick={() => onDelete(update)} title="Delete" className="text-[#6B7280] hover:text-[#EF4444]">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}