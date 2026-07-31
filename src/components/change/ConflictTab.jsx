import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import Pill from "@/components/common/Pill";
import ConfidenceTag from "@/components/common/ConfidenceTag";

export default function ConflictTab({ assumptions, conflicts }) {
  const open = conflicts.filter((c) => !c.resolved);
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          What each team seems to assume
        </h3>
        <div className="mt-4 space-y-3">
          {assumptions.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5">
              <span className="font-heading text-sm font-semibold">{a.discipline}</span>
              <p className="mt-1 text-sm">{a.statement}</p>
              <div className="mt-3">
                <ConfidenceTag level={a.confidence} source="Team notes" />
              </div>
            </div>
          ))}
          {assumptions.length === 0 ? <p className="text-sm text-muted-foreground">No assumptions recorded yet.</p> : null}
        </div>
      </div>

      {conflicts.length === 0 ? (
        <div className="flex items-center gap-3 rounded-2xl border border-risk-low/30 bg-risk-low-soft p-5 text-risk-low">
          <CheckCircle2 className="h-5 w-5" />
          <p className="text-sm font-medium">No conflict found. Both teams read this change the same way.</p>
        </div>
      ) : (
        conflicts.map((c) => (
          <div key={c.id} className="rounded-2xl border border-risk-high/30 bg-risk-high-soft p-6">
            <div className="flex flex-wrap items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-risk-high" />
              <span className="font-heading text-sm font-semibold text-risk-high">
                {c.resolved ? "Conflict, now resolved" : "Teams read this differently"}
              </span>
              {(c.disciplines || []).map((d) => (
                <Pill key={d} tone="neutral">
                  {d}
                </Pill>
              ))}
            </div>
            <p className="mt-3 text-sm">{c.description}</p>
            <div className="mt-4 rounded-xl bg-card p-4">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">The one question to answer</p>
              <p className="mt-1 text-sm font-medium">{c.open_question}</p>
            </div>
            <div className="mt-4">
              <ConfidenceTag level={c.confidence} source="Assumptions above" />
            </div>
          </div>
        ))
      )}
    </div>
  );
}