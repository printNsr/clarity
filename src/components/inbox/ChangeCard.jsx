import React from "react";
import { Link } from "react-router-dom";
import UrgencyDot from "@/components/common/UrgencyDot";
import Pill from "@/components/common/Pill";

export default function ChangeCard({ change }) {
  return (
    <Link
      to={`/change/${change.id}`}
      className="block rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <UrgencyDot level={change.urgency} />
            <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {change.urgency} urgency
            </span>
          </div>
          <h3 className="mt-2 font-heading text-lg font-semibold leading-snug">{change.title}</h3>
          {change.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{change.description}</p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Pill tone={change.status}>{change.status}</Pill>
          {change.needs_decision && change.status !== "resolved" ? (
            <span className="text-xs text-muted-foreground">needs a decision</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}