import React, { useState } from "react";
import DisciplineChip from "@/components/common/DisciplineChip";
import Pill from "@/components/common/Pill";

export default function TeamViewTab({ impacts, change }) {
  const [active, setActive] = useState(impacts[0]?.discipline);
  const current = impacts.find((i) => i.discipline === active) || impacts[0];
  if (!current) return <p className="text-sm text-muted-foreground">No team views yet.</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {impacts.map((i) => (
          <DisciplineChip key={i.id} name={i.discipline} active={i.discipline === current.discipline} onClick={() => setActive(i.discipline)} />
        ))}
      </div>
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">What changed</p>
          <p className="mt-1 text-sm">{current.team_what || change.description}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">What it means for you</p>
          <p className="mt-1 text-sm">{current.team_means || current.reason}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Your risk level</p>
          <div className="mt-1">
            <Pill tone={current.severity}>{current.severity} risk</Pill>
          </div>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">What to do</p>
          <p className="mt-1 text-sm">{current.team_todo || "Review the numbers and confirm with the project manager."}</p>
        </div>
      </div>
    </div>
  );
}