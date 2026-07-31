import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import StatusBadge from "@/components/clarity/StatusBadge";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DISCIPLINE_NAMES } from "@/components/clarity/disciplines";

export default function DrawingsListPage() {
  const { project } = useClarity();
  const [drawings, setDrawings] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ drawing_number: "", title: "", discipline: "Electrical", revision: "A" });

  const load = useCallback(async () => {
    if (!project) return;
    setDrawings(await base44.entities.Drawing.filter({ project_id: project.id }, "-created_date", 200));
  }, [project]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.drawing_number.trim()) return;
    await base44.entities.Drawing.create({ ...form, project_id: project.id, status: "Issued" });
    setForm({ drawing_number: "", title: "", discipline: "Electrical", revision: "A" });
    setOpen(false);
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold">Drawings</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2563EB] px-3 text-[12px] font-medium text-white">
            <Plus className="h-3.5 w-3.5" /> Add Drawing
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="text-[15px]">Add drawing</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input value={form.drawing_number} onChange={(e) => setForm({ ...form, drawing_number: e.target.value })} placeholder="Drawing number" className="h-9 text-[13px]" />
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="h-9 text-[13px]" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.discipline} onChange={(e) => setForm({ ...form, discipline: e.target.value })} className="h-9 rounded-md border border-[#E5E7EB] px-2 text-[13px]">
                  {DISCIPLINE_NAMES.map((d) => <option key={d}>{d}</option>)}
                </select>
                <Input value={form.revision} onChange={(e) => setForm({ ...form, revision: e.target.value })} placeholder="Revision" className="h-9 text-[13px]" />
              </div>
              <button onClick={save} className="h-9 w-full rounded-md bg-[#2563EB] text-[12px] font-medium text-white">Save drawing</button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {drawings.length === 0 ? (
        <p className="rounded-[10px] border border-dashed border-[#E5E7EB] bg-white p-10 text-center text-[12px] text-[#6B7280]">
          No drawings have been uploaded.
        </p>
      ) : (
        <div className="divide-y divide-[#F1F5F9] rounded-[10px] border border-[#E5E7EB] bg-white">
          {drawings.map((d) => (
            <Link key={d.id} to={`/drawings/${d.id}/update`} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC]">
              <DisciplineIcon name={d.discipline} size="sm" />
              <span className="text-[13px] font-medium">{d.drawing_number}</span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-[#6B7280]">{d.title}</span>
              <span className="text-[11px] text-[#6B7280]">Rev {d.revision}</span>
              <StatusBadge>{d.status}</StatusBadge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}