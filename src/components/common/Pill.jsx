import React from "react";
import { cn } from "@/lib/utils";

const tones = {
  high: "bg-risk-high-soft text-risk-high border-risk-high/30",
  med: "bg-risk-med-soft text-risk-med border-risk-med/30",
  low: "bg-risk-low-soft text-risk-low border-risk-low/30",
  unresolved: "bg-risk-high-soft text-risk-high border-risk-high/30",
  resolved: "bg-risk-low-soft text-risk-low border-risk-low/30",
  draft: "bg-accent/25 text-foreground border-accent",
  neutral: "bg-muted text-muted-foreground border-border",
};

export default function Pill({ tone = "neutral", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}