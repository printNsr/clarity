import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import Pill from "@/components/common/Pill";

export default function NodePanel({ node, onClose }) {
  if (!node) return null;
  const d = node.data || {};
  return (
    <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-sm overflow-y-auto border-l border-border bg-card p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <Pill tone="draft">{node.kind}</Pill>
        <button onClick={onClose}><X className="h-4 w-4" /></button>
      </div>
      <h2 className="mt-4 font-heading text-lg font-semibold">{node.label}</h2>

      {node.kind === "Change" ? (
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-muted-foreground">{d.description}</p>
          <div className="flex gap-2">
            <Pill tone={d.urgency}>{d.urgency} urgency</Pill>
            <Pill tone={d.status}>{d.status}</Pill>
          </div>
          <Link to={`/change/${d.id}`} className="inline-block font-medium underline underline-offset-4">
            Open the full record
          </Link>
        </div>
      ) : null}

      {node.kind === "Decision" ? (
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-muted-foreground">{d.chosen_reason}</p>
          <p className="font-mono text-[11px] text-muted-foreground">
            {d.resolver} on {d.decision_date}
          </p>
          <div className="flex flex-wrap gap-2">
            {(d.disciplines || []).map((x) => (
              <Pill key={x} tone="neutral">{x}</Pill>
            ))}
          </div>
          <Link to="/timeline" className="inline-block font-medium underline underline-offset-4">
            Open the full record
          </Link>
        </div>
      ) : null}

      {node.kind === "Jira" ? (
        <div className="mt-4 space-y-3 text-sm">
          <p className="text-muted-foreground">{d.summary}</p>
          <a href={d.url || "#"} target="_blank" rel="noreferrer" className="inline-block font-medium underline underline-offset-4">
            Open in Jira
          </a>
        </div>
      ) : null}
    </aside>
  );
}