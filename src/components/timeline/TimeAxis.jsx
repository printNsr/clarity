import React from "react";
import { cn } from "@/lib/utils";
import { roleGroup, roleDot, roleLabel } from "./roleTone";

const fmt = (d) => new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function TimeAxis({ entries, onSelect }) {
  const dated = entries.filter((e) => e.decision_date).sort((a, b) => a.decision_date.localeCompare(b.decision_date));
  if (dated.length === 0) return null;

  const start = new Date(dated[0].decision_date).getTime();
  const end = new Date(dated[dated.length - 1].decision_date).getTime();
  const span = end - start || 1;
  const pos = (d) => (dated.length === 1 ? 50 : ((new Date(d).getTime() - start) / span) * 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Time line</p>
        <div className="flex flex-wrap items-center gap-4">
          {["eng", "mgr", "other"].map((g) => (
            <span key={g} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("h-2.5 w-2.5 rounded-full", roleDot[g])} />
              {roleLabel[g]}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden px-16 sm:px-20">
      <div className="relative mt-10 mb-14 h-0.5 rounded-full bg-border">
        {dated.map((e, i) => {
          const g = roleGroup(e.resolver_role);
          const left = pos(e.decision_date);
          const above = i % 2 === 0;
          return (
            <button
              key={e.id}
              onClick={() => onSelect(e.id)}
              className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%` }}
              title={`${fmt(e.decision_date)} — ${e.change_title}`}
            >
              <span className={cn("block h-3.5 w-3.5 rounded-full ring-4 ring-card transition-transform group-hover:scale-125", roleDot[g])} />
              <span
                className={cn(
                  "pointer-events-none absolute left-1/2 w-32 -translate-x-1/2 text-center text-[11px] leading-tight",
                  above ? "bottom-5" : "top-5"
                )}
              >
                <span className="block font-mono text-muted-foreground">{fmt(e.decision_date)}</span>
                <span className="block truncate font-medium text-foreground">{e.change_title}</span>
              </span>
            </button>
          );
        })}
      </div>
      </div>

      <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>{fmt(dated[0].decision_date)}</span>
        <span>{fmt(dated[dated.length - 1].decision_date)}</span>
      </div>
    </div>
  );
}