import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import Pill from "@/components/common/Pill";

export default function SourcesTab({ sources }) {
  if (!sources.length) return <p className="text-sm text-muted-foreground">No sources linked yet.</p>;
  return (
    <div className="space-y-3">
      {sources.map((s) => (
        <a
          key={s.id}
          href={s.url || "#"}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent"
        >
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{s.title}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{s.ref}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Pill tone="neutral">{s.kind}</Pill>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </a>
      ))}
    </div>
  );
}