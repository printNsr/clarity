import React from "react";
import { Check, X } from "lucide-react";
import JiraLink from "@/components/common/JiraLink";

export default function DecisionRecord({ entry }) {
  return (
    <div className="space-y-6 border-t border-border pt-6">
      {entry.conflict_text ? (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">The clash that led to this</p>
          <p className="mt-1 text-sm">{entry.conflict_text}</p>
        </div>
      ) : null}

      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Options considered</p>
        <div className="mt-3 space-y-3">
          {(entry.options || []).map((o, i) => {
            const isChosen = o.label === entry.chosen_option;
            return (
              <div key={i} className={`rounded-xl border p-4 ${isChosen ? "border-risk-low/40 bg-risk-low-soft" : "border-border bg-card"}`}>
                <div className="flex items-center gap-2">
                  {isChosen ? <Check className="h-4 w-4 text-risk-low" /> : <X className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">{o.label}</span>
                </div>
                {o.description ? <p className="mt-1 text-sm text-muted-foreground">{o.description}</p> : null}
                {!isChosen && o.rejected_reason ? (
                  <p className="mt-1 text-sm">Not picked because {o.rejected_reason}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Why this was chosen</p>
        <p className="mt-1 text-sm">{entry.chosen_reason}</p>
      </div>

      {(entry.jira_links || []).length ? (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Affected Jira items</p>
          <div className="mt-3 space-y-2">
            {entry.jira_links.map((j, i) => (
              <JiraLink key={i} item={j} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}