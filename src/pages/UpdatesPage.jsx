import React, { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import NewTradeUpdateDialog from "@/components/clarity/updates/NewTradeUpdateDialog";
import TradeUpdateItem from "@/components/clarity/updates/TradeUpdateItem";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";
import { DISCIPLINE_NAMES } from "@/components/clarity/disciplines";
import { cn } from "@/lib/utils";

export default function UpdatesPage() {
  const { project } = useClarity();
  const [updates, setUpdates] = useState([]);
  const [trade, setTrade] = useState("All");
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = useCallback(async () => {
    if (!project) return;
    setUpdates(await base44.entities.TradeUpdate.filter({ project_id: project.id }, "-posted_at", 200));
  }, [project]);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => updates.filter((u) => {
    if (trade !== "All" && u.discipline !== trade) return false;
    if (unreadOnly && u.acknowledged) return false;
    return true;
  }), [updates, trade, unreadOnly]);

  const acknowledge = async (u) => { await base44.entities.TradeUpdate.update(u.id, { acknowledged: true }); load(); };
  const remove = async (u) => { await base44.entities.TradeUpdate.delete(u.id); load(); };
  const markAllRead = async () => {
    await Promise.all(shown.filter((u) => !u.acknowledged).map((u) => base44.entities.TradeUpdate.update(u.id, { acknowledged: true })));
    load();
  };

  const unread = updates.filter((u) => !u.acknowledged).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold">Updates</h1>
          <p className="text-[12px] text-[#6B7280]">Notifications posted by the trade reps on this project. {unread} unread.</p>
        </div>
        <NewTradeUpdateDialog project={project} onCreated={load} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTrade("All")}
          className={cn("h-9 rounded-md border px-3 text-[12px]", trade === "All" ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]")}
        >
          All trades ({updates.length})
        </button>
        {DISCIPLINE_NAMES.map((d) => {
          const count = updates.filter((u) => u.discipline === d).length;
          return (
            <button
              key={d}
              onClick={() => setTrade(trade === d ? "All" : d)}
              className={cn("inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-[12px]", trade === d ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]")}
            >
              <DisciplineIcon name={d} size="sm" /> {d} ({count})
            </button>
          );
        })}
        <label className="ml-auto flex items-center gap-1.5 text-[12px] text-[#6B7280]">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} /> Unread only
        </label>
        <button onClick={markAllRead} className="h-9 rounded-md border border-[#E5E7EB] bg-white px-3 text-[12px] hover:bg-[#F8FAFC]">Mark all read</button>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-[10px] border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-[12px] text-[#6B7280]">
          No updates from trade reps yet.
        </p>
      ) : (
        <div className="rounded-[10px] border border-[#E5E7EB] bg-white">
          {shown.map((u) => (
            <TradeUpdateItem key={u.id} update={u} onAcknowledge={acknowledge} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}