import React from "react";
import { cn } from "@/lib/utils";

export const GROUP_OPTIONS = [
  { value: "none", label: "No grouping" },
  { value: "urgency", label: "Urgency" },
  { value: "status", label: "Status" },
  { value: "decision", label: "Needs a decision" },
  { value: "owner", label: "Decision owner" },
];

export default function GroupSelect({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Group by</span>
      {GROUP_OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs transition-colors",
            value === o.value
              ? "border-accent bg-accent text-accent-foreground font-medium"
              : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}