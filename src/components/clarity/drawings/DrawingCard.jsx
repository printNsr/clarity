import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";
import StatusBadge from "@/components/clarity/StatusBadge";
import { disc } from "@/components/clarity/disciplines";
import { fmtDate } from "@/components/clarity/clarityApi";

export default function DrawingCard({ drawing }) {
  const d = disc(drawing.discipline);
  return (
    <Link
      to={`/drawings/${drawing.id}/update`}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:shadow-[0_8px_24px_rgba(16,24,40,0.08)]"
    >
      <div className={`relative h-28 ${d.soft} border-b ${d.border}`}>
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "linear-gradient(#0000000d 1px, transparent 1px), linear-gradient(90deg, #0000000d 1px, transparent 1px)", backgroundSize: "14px 14px" }}
        />
        <div className="absolute inset-3 rounded-md border border-white/70 bg-white/50" />
        <span className="absolute left-3 top-3 rounded-md bg-white/90 px-1.5 py-0.5 font-mono text-[11px] font-medium">
          {drawing.drawing_number}
        </span>
        <span className="absolute bottom-3 right-3 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] text-[#6B7280]">
          Rev {drawing.revision || "A"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-start gap-2">
          <DisciplineIcon name={drawing.discipline} size="sm" />
          <p className="min-w-0 flex-1 text-[13px] font-medium leading-snug">{drawing.title || "Untitled drawing"}</p>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#CBD5E1] transition-colors group-hover:text-[#2563EB]" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <StatusBadge>{drawing.status}</StatusBadge>
          <span className="text-[11px] text-[#9CA3AF]">{fmtDate(drawing.issued_date || drawing.created_date)}</span>
        </div>
      </div>
    </Link>
  );
}