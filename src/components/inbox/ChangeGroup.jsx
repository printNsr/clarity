import React from "react";
import ChangeCard from "./ChangeCard";

export default function ChangeGroup({ label, changes }) {
  return (
    <section className="space-y-4">
      {label ? (
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">{label}</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            {changes.length}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      ) : null}
      <div className="space-y-4">
        {changes.map((c) => (
          <ChangeCard key={c.id} change={c} />
        ))}
      </div>
    </section>
  );
}