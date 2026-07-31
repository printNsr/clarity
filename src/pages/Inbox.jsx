import React, { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import FlaggedPanel from "@/components/inbox/FlaggedPanel";
import NewChangeDialog from "@/components/inbox/NewChangeDialog";
import GroupSelect from "@/components/inbox/GroupSelect";
import ChangeGroup from "@/components/inbox/ChangeGroup";
import { groupChanges } from "@/components/inbox/groupChanges";

export default function Inbox() {
  const [changes, setChanges] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState("urgency");

  const groups = useMemo(() => groupChanges(changes, groupBy), [changes, groupBy]);

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

      <GroupSelect value={groupBy} onChange={setGroupBy} />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading changes</p>
      ) : changes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No changes yet. Paste a note to add the first one.
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((g) => (
            <ChangeGroup key={g.label || "all"} label={g.label} changes={g.changes} />
          ))}
        </div>
      )}
    </div>
  );
}