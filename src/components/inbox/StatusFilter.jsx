import React from "react";
import { cn } from "@/lib/utils";

export const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "unresolved", label: "Unresolved" },
  { value: "resolved", label: "Resolved" },
];

export default function StatusFilter({ value, onChange, counts = {} }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Status</span>
      {STATUS_OPTIONS.map((o) => (
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
          <span className="ml-1.5 font-mono opacity-70">{counts[o.value] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}