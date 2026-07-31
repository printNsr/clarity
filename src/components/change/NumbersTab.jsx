import React from "react";
import ConfidenceTag from "@/components/common/ConfidenceTag";

export default function NumbersTab({ impacts }) {
  const withMetrics = impacts.filter((i) => (i.metrics || []).length);
  if (!withMetrics.length) return <p className="text-sm text-muted-foreground">No numbers recorded yet.</p>;

  return (
    <div className="space-y-8">
      {withMetrics.map((i) => (
        <div key={i.id} className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-heading text-base font-semibold">{i.discipline}</h3>
            <ConfidenceTag level={i.confidence} source={i.source_ref} />
          </div>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="pb-2">Item</th>
                <th className="pb-2">Before</th>
                <th className="pb-2">After</th>
                <th className="pb-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {i.metrics.map((m, idx) => (
                <tr key={idx} className="border-t border-border">
                  <td className="py-2 pr-4">{m.label}</td>
                  <td className="py-2 pr-4 font-mono">{m.before}</td>
                  <td className="py-2 pr-4 font-mono">{m.after}</td>
                  <td className="py-2 font-mono font-medium">{m.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {i.note ? <p className="mt-4 text-sm text-muted-foreground">{i.note}</p> : null}
        </div>
      ))}
    </div>
  );
}