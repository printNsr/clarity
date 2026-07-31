import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Layers, ScanLine } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import DrawingCard from "@/components/clarity/drawings/DrawingCard";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DISCIPLINE_NAMES } from "@/components/clarity/disciplines";

export default function DrawingsListPage() {
  const { project } = useClarity();
  const [drawings, setDrawings] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ drawing_number: "", title: "", discipline: "Electrical", revision: "A" });
  const [trade, setTrade] = useState("All");

  const load = useCallback(async () => {
    if (!project) return;
    setDrawings(await base44.entities.Drawing.filter({ project_id: project.id }, "-created_date", 200));
  }, [project]);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(
    () => (trade === "All" ? drawings : drawings.filter((d) => d.discipline === trade)),
    [drawings, trade]
  );

  const save = async () => {
    if (!form.drawing_number.trim()) return;
    await base44.entities.Drawing.create({ ...form, project_id: project.id, status: "Issued" });
    setForm({ drawing_number: "", title: "", discipline: "Electrical", revision: "A" });
    setOpen(false);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Drawings</h1>
          <p className="text-[12px] text-[#6B7280]">{drawings.length} sheets on this project.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/drawings/analyzer" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#7C3AED] bg-white px-3 text-[12px] font-medium text-[#7C3AED] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7C3AED] hover:text-white hover:shadow-md hover:shadow-[#7C3AED]/30">
            <ScanLine className="h-3.5 w-3.5" /> Plan Analyzer
          </Link>
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
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTrade("All")}
          className={cn("h-8 rounded-full border px-3 text-[12px] transition-colors", trade === "All" ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F8FAFC]")}
        >
          All ({drawings.length})
        </button>
        {DISCIPLINE_NAMES.map((d) => {
          const count = drawings.filter((x) => x.discipline === d).length;
          return (
            <button
              key={d}
              onClick={() => setTrade(trade === d ? "All" : d)}
              className={cn("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] transition-colors", trade === d ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F8FAFC]")}
            >
              <DisciplineIcon name={d} size="sm" /> {d} ({count})
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-[#E5E7EB] bg-white p-14 text-center">
          <Layers className="mx-auto h-6 w-6 text-[#CBD5E1]" />
          <p className="mt-2 text-[13px] font-medium">No drawings here yet</p>
          <p className="text-[12px] text-[#6B7280]">Add a sheet to start tracking revisions.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map((d) => <DrawingCard key={d.id} drawing={d} />)}
        </div>
      )}
    </div>
  );
}