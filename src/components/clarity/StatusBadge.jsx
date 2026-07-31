import React from "react";
import { cn } from "@/lib/utils";

const TONES = {
  red: "bg-[#FEF2F2] text-[#EF4444] border-[#FECACA]",
  orange: "bg-[#FFF7ED] text-[#F59E0B] border-[#FED7AA]",
  green: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
  blue: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  grey: "bg-[#F8FAFC] text-[#6B7280] border-[#E5E7EB]",
};

const STATUS_TONE = {
  "Potential Collision": "red",
  Invalidated: "red",
  High: "red",
  "Decision Recorded": "orange",
  "In Progress": "orange",
  "Update Requested": "orange",
  Medium: "orange",
  Inferred: "orange",
  Pending: "orange",
  Verified: "green",
  Updated: "green",
  Resolved: "green",
  Stated: "green",
  Confirmed: "green",
  Low: "green",
  "RFI Sent": "blue",
  Sent: "blue",
  Open: "blue",
  Missing: "red",
  Contradicted: "red",
};

export function toneFor(status) {
  return STATUS_TONE[status] || "grey";
}

export default function StatusBadge({ children, tone, className }) {
  const t = TONES[tone || toneFor(children)] || TONES.grey;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", t, className)}>
      {children}
    </span>
  );
}