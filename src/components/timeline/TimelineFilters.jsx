import React from "react";
import { Input } from "@/components/ui/input";
import DisciplineChip from "@/components/common/DisciplineChip";

const DISCIPLINES = ["Mechanical", "Electrical", "Fire", "QS", "Architecture", "Structural", "PM"];

export default function TimelineFilters({ filters, setFilters, resolvers }) {
  const set = (k, v) => setFilters({ ...filters, [k]: v });
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <Input
        placeholder="Search titles, resolvers and outcomes"
        value={filters.q}
        onChange={(e) => set("q", e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <DisciplineChip name="All teams" active={!filters.discipline} onClick={() => set("discipline", "")} />
        {DISCIPLINES.map((d) => (
          <DisciplineChip key={d} name={d} active={filters.discipline === d} onClick={() => set("discipline", d)} />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <select
          className="rounded-md border border-border bg-card px-3 py-2 text-sm"
          value={filters.resolver}
          onChange={(e) => set("resolver", e.target.value)}
        >
          <option value="">Any resolver</option>
          {resolvers.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <Input type="date" value={filters.from} onChange={(e) => set("from", e.target.value)} />
        <Input type="date" value={filters.to} onChange={(e) => set("to", e.target.value)} />
      </div>
      <Input placeholder="Filter by outcome" value={filters.outcome} onChange={(e) => set("outcome", e.target.value)} />
    </div>
  );
}