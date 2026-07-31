import React, { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import FlaggedPanel from "@/components/inbox/FlaggedPanel";
import NewChangeDialog from "@/components/inbox/NewChangeDialog";
import GroupSelect from "@/components/inbox/GroupSelect";
import StatusFilter from "@/components/inbox/StatusFilter";
import ChangeGroup from "@/components/inbox/ChangeGroup";
import { groupChanges } from "@/components/inbox/groupChanges";

export default function Inbox() {
  const [changes, setChanges] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState("urgency");
  const [status, setStatus] = useState("all");

  const counts = useMemo(
    () => ({
      all: changes.length,
      draft: changes.filter((c) => c.status === "draft").length,
      unresolved: changes.filter((c) => c.status === "unresolved").length,
      resolved: changes.filter((c) => c.status === "resolved").length,
    }),
    [changes]
  );

  const visible = useMemo(
    () => (status === "all" ? changes : changes.filter((c) => c.status === status)),
    [changes, status]
  );

  const groups = useMemo(() => groupChanges(visible, groupBy), [visible, groupBy]);

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

      <div className="space-y-3">
        <StatusFilter value={status} onChange={setStatus} counts={counts} />
        <GroupSelect value={groupBy} onChange={setGroupBy} />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading changes</p>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          {changes.length === 0 ? "No changes yet. Paste a note to add the first one." : "No changes with this status."}
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