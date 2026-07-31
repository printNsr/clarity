import React, { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import TimelineFilters from "@/components/timeline/TimelineFilters";
import TimelineEntry from "@/components/timeline/TimelineEntry";
import TimeAxis from "@/components/timeline/TimeAxis";
import { exportEntriesCsv } from "@/components/timeline/exportEntries";

export default function DecisionTimeline() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ q: "", discipline: "", resolver: "", from: "", to: "", outcome: "" });

  useEffect(() => {
    base44.entities.DecisionEntry.list("-decision_date").then(setEntries);
  }, []);

  const resolvers = useMemo(() => [...new Set(entries.map((e) => e.resolver).filter(Boolean))], [entries]);

  const filtered = useMemo(() => {
    const q = filters.q.toLowerCase();
    return entries.filter((e) => {
      const blob = `${e.title} ${e.change_title} ${e.resolver} ${e.chosen_option} ${e.chosen_reason}`.toLowerCase();
      if (q && !blob.includes(q)) return false;
      if (filters.discipline && !(e.disciplines || []).includes(filters.discipline)) return false;
      if (filters.resolver && e.resolver !== filters.resolver) return false;
      if (filters.outcome && !(e.chosen_option || "").toLowerCase().includes(filters.outcome.toLowerCase())) return false;
      if (filters.from && (e.decision_date || "") < filters.from) return false;
      if (filters.to && (e.decision_date || "") > filters.to) return false;
      return true;
    });
  }, [entries, filters]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Decision Timeline</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every call that was made, who made it and why.</p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={() => exportEntriesCsv(filtered)}>
          <Download className="mr-2 h-4 w-4" /> Export this list
        </Button>
      </div>

      <TimelineFilters filters={filters} setFilters={setFilters} resolvers={resolvers} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No decisions match these filters.
        </div>
      ) : (
        <div className="space-y-4">
          <TimeAxis
            entries={filtered}
            onSelect={(id) => document.getElementById(`entry-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          />
          {filtered.map((e) => (
            <TimelineEntry key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}