import React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export const RELATIONSHIPS = ["Caused this", "Affected by this", "Resolves this", "Blocks this", "Duplicates this"];

export const relColor = {
  "Caused this": "bg-risk-high-soft text-risk-high border-risk-high/30",
  "Affected by this": "bg-risk-med-soft text-risk-med border-risk-med/30",
  "Resolves this": "bg-risk-low-soft text-risk-low border-risk-low/30",
  "Blocks this": "bg-accent/25 text-foreground border-accent",
  "Duplicates this": "bg-muted text-muted-foreground border-border",
};

export default function JiraLink({ item }) {
  return (
    <a
      href={item.url || "#"}
      target="_blank"
      rel="noreferrer"
      className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-accent"
    >
      <span className="font-mono text-xs font-semibold">{item.key}</span>
      <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{item.summary}</span>
      <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", relColor[item.relationship] || relColor["Duplicates this"])}>
        {item.relationship}
      </span>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
    </a>
  );
}