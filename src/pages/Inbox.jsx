import React, { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import ChangeCard from "@/components/inbox/ChangeCard";
import FlaggedPanel from "@/components/inbox/FlaggedPanel";
import NewChangeDialog from "@/components/inbox/NewChangeDialog";

export default function Inbox() {
  const [changes, setChanges] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [c, m] = await Promise.all([
      base44.entities.Change.list("-created_date"),
      base44.entities.Message.filter({ flagged: true }, "-created_date", 5),
    ]);
    setChanges(c);
    setFlagged(m);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Inbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every change on the project and what it means for each team.</p>
        </div>
        <NewChangeDialog onCreated={load} />
      </div>

      <FlaggedPanel messages={flagged} />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading changes</p>
      ) : changes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No changes yet. Paste a note to add the first one.
        </div>
      ) : (
        <div className="space-y-4">
          {changes.map((c) => (
            <ChangeCard key={c.id} change={c} />
          ))}
        </div>
      )}
    </div>
  );
}