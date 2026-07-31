import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Pill from "@/components/common/Pill";
import DecisionRecord from "./DecisionRecord";

export default function TimelineEntry({ entry }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <button className="flex w-full items-start justify-between gap-4 text-left" onClick={() => setOpen(!open)}>
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-muted-foreground">{entry.decision_date}</p>
          <h3 className="mt-1 font-heading text-base font-semibold">{entry.change_title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">Outcome: {entry.chosen_option}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill tone="draft">{entry.resolver}{entry.resolver_role ? `, ${entry.resolver_role}` : ""}</Pill>
            {(entry.disciplines || []).map((d) => (
              <Pill key={d} tone="neutral">{d}</Pill>
            ))}
          </div>
        </div>
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="mt-6 space-y-6">
          <DecisionRecord entry={entry} />
          {entry.change_id ? (
            <Link to={`/change/${entry.change_id}`} className="text-sm font-medium underline underline-offset-4">
              Open the full change record
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}