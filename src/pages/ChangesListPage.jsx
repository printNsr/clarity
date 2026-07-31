import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import NewChangeDialog from "@/components/clarity/changes/NewChangeDialog";
import StatusBadge from "@/components/clarity/StatusBadge";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";
import { Input } from "@/components/ui/input";
import { fmtDate } from "@/components/clarity/clarityApi";

export default function ChangesListPage({ collisionsOnly = false }) {
  const { project } = useClarity();
  const [issues, setIssues] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const load = useCallback(async () => {
    if (!project) return;
    setIssues(await base44.entities.ChangeIssue.filter({ project_id: project.id }, "-created_date", 200));
  }, [project]);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => issues.filter((i) => {
    if (collisionsOnly && i.status !== "Potential Collision") return false;
    if (status !== "All" && i.status !== status) return false;
    if (priority !== "All" && i.priority !== priority) return false;
    if (q && !`${i.title} ${i.zone} ${i.level}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [issues, q, status, priority, collisionsOnly]);

  const remove = async (id) => {
    if (!window.confirm("Delete this change and stop tracking it?")) return;
    await base44.entities.ChangeIssue.delete(id);
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold">{collisionsOnly ? "Collisions" : "Changes"}</h1>
        <NewChangeDialog project={project} onCreated={load} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search changes" className="h-9 w-56 text-[12px]" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-[#E5E7EB] bg-white px-2 text-[12px]">
          {["All", "Open", "Potential Collision", "Decision Recorded", "RFI Sent", "Drawing Updated", "Verified", "Invalidated"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-9 rounded-md border border-[#E5E7EB] bg-white px-2 text-[12px]">
          {["All", "High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-[10px] border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-[12px] text-[#6B7280]">
          No design changes have been created.
        </p>
      ) : (
        <div className="divide-y divide-[#F1F5F9] rounded-[10px] border border-[#E5E7EB] bg-white">
          {shown.map((i) => (
            <div key={i.id} className="group flex items-center gap-3 px-4 py-3">
              <Link to={`/changes/${i.id}`} className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{i.title}</p>
                <p className="truncate text-[11px] text-[#6B7280]">{[i.level, i.zone].filter(Boolean).join(", ")} · due {fmtDate(i.due_date) || "not set"}</p>
              </Link>
              <div className="hidden gap-1 md:flex">
                {(i.disciplines || []).map((d) => <DisciplineIcon key={d} name={d} size="sm" />)}
              </div>
              <StatusBadge>{i.priority}</StatusBadge>
              <StatusBadge>{i.status}</StatusBadge>
              <button onClick={() => remove(i.id)} className="opacity-0 transition-opacity group-hover:opacity-100">
                <Trash2 className="h-3.5 w-3.5 text-[#6B7280] hover:text-[#EF4444]" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}