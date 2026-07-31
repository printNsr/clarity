import React from "react";
import Pill from "@/components/common/Pill";
import UrgencyDot from "@/components/common/UrgencyDot";
import ConfidenceTag from "@/components/common/ConfidenceTag";

export default function WhatChangedTab({ change, impacts }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={change.urgency}>
          <UrgencyDot level={change.urgency} /> {change.urgency} urgency
        </Pill>
        <Pill tone={change.status}>{change.status}</Pill>
        <Pill tone={change.needs_decision ? "med" : "neutral"}>
          {change.needs_decision ? "A decision is needed" : "No decision needed"}
        </Pill>
      </div>

      <p className="max-w-2xl text-[15px] leading-relaxed">{change.description}</p>

      <div>
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">Teams affected</h3>
        <div className="mt-4 space-y-3">
          {impacts.map((i) => (
            <div key={i.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-heading text-sm font-semibold">{i.discipline}</span>
                <Pill tone={i.severity}>{i.severity} risk</Pill>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{i.reason}</p>
              <div className="mt-3">
                <ConfidenceTag level={i.confidence} source={i.source_ref} />
              </div>
            </div>
          ))}
          {impacts.length === 0 ? <p className="text-sm text-muted-foreground">No teams listed yet.</p> : null}
        </div>
      </div>
    </div>
  );
}