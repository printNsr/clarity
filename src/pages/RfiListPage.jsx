import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import StatusBadge from "@/components/clarity/StatusBadge";
import { Input } from "@/components/ui/input";
import { fmtDate } from "@/components/clarity/clarityApi";

export default function RfiListPage() {
  const { project } = useClarity();
  const [rfis, setRfis] = useState([]);
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    if (!project) return;
    setRfis(await base44.entities.RFI.filter({ project_id: project.id }, "-created_date", 200));
  }, [project]);

  useEffect(() => { load(); }, [load]);

  const shown = rfis.filter((r) => `${r.rfi_number} ${r.title}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-3">
      <h1 className="text-[22px] font-semibold">RFIs</h1>
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search RFIs" className="h-9 w-56 text-[12px]" />
      {shown.length === 0 ? (
        <p className="rounded-[10px] border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-[12px] text-[#6B7280]">
          No RFIs have been created. Record a decision on a change to draft one.
        </p>
      ) : (
        <div className="divide-y divide-[#F1F5F9] rounded-[10px] border border-[#E5E7EB] bg-white">
          {shown.map((r) => (
            <Link key={r.id} to={`/rfis/${r.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC]">
              <span className="text-[13px] font-semibold text-[#2563EB]">{r.rfi_number}</span>
              <span className="min-w-0 flex-1 truncate text-[13px]">{r.title}</span>
              <span className="text-[11px] text-[#6B7280]">{fmtDate(r.due_date)}</span>
              <StatusBadge>{r.priority}</StatusBadge>
              <StatusBadge>{r.status}</StatusBadge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}