import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DISCIPLINE_NAMES } from "../disciplines";
import { logEvent } from "../clarityApi";
import { cn } from "@/lib/utils";

const TYPES = ["Design change", "Site condition", "Drawing discrepancy", "Coordination issue", "Client request", "Compliance concern", "Missing information", "Other"];

const EMPTY = {
  title: "", description: "", level: "", zone: "", stage: "Design Development",
  change_type: "Design change", priority: "Medium", owner: "", owner_role: "",
  due_date: "", disciplines: [], elements: "", related_drawings: "",
};

export default function NewChangeDialog({ project, onCreated }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleDiscipline = (d) =>
    set("disciplines", form.disciplines.includes(d) ? form.disciplines.filter((x) => x !== d) : [...form.disciplines, d]);

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const issue = await base44.entities.ChangeIssue.create({
      ...form,
      project_id: project?.id,
      status: "Open",
      collision_risk: "None",
      elements: form.elements.split(",").map((s) => s.trim()).filter(Boolean),
      related_drawings: form.related_drawings.split(",").map((s) => s.trim()).filter(Boolean),
      due_date: form.due_date || undefined,
    });
    await logEvent(issue, "change_created", "Change created", { description: issue.title, severity: issue.priority });
    setSaving(false);
    setOpen(false);
    setForm(EMPTY);
    onCreated?.();
    navigate(`/changes/${issue.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2563EB] px-3 text-[12px] font-medium text-white hover:bg-[#1D4ED8]">
        <Plus className="h-3.5 w-3.5" /> New Change
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle className="text-[15px]">New design change</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Change title" className="h-9 text-[13px]" />
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Description" className="text-[13px]" />
          <div className="grid grid-cols-2 gap-3">
            <Input value={form.level} onChange={(e) => set("level", e.target.value)} placeholder="Building level" className="h-9 text-[13px]" />
            <Input value={form.zone} onChange={(e) => set("zone", e.target.value)} placeholder="Zone or corridor" className="h-9 text-[13px]" />
            <Input value={form.stage} onChange={(e) => set("stage", e.target.value)} placeholder="Stage" className="h-9 text-[13px]" />
            <select value={form.change_type} onChange={(e) => set("change_type", e.target.value)} className="h-9 rounded-md border border-[#E5E7EB] px-2 text-[13px]">
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className="h-9 rounded-md border border-[#E5E7EB] px-2 text-[13px]">
              {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
            </select>
            <Input type="date" value={form.due_date} onChange={(e) => set("due_date", e.target.value)} className="h-9 text-[13px]" />
            <Input value={form.owner} onChange={(e) => set("owner", e.target.value)} placeholder="Owner" className="h-9 text-[13px]" />
            <Input value={form.owner_role} onChange={(e) => set("owner_role", e.target.value)} placeholder="Owner role" className="h-9 text-[13px]" />
            <Input value={form.elements} onChange={(e) => set("elements", e.target.value)} placeholder="Elements, comma separated" className="h-9 text-[13px]" />
            <Input value={form.related_drawings} onChange={(e) => set("related_drawings", e.target.value)} placeholder="Drawings, comma separated" className="h-9 text-[13px]" />
          </div>
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-wide text-[#6B7280]">Affected disciplines</p>
            <div className="flex flex-wrap gap-2">
              {DISCIPLINE_NAMES.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleDiscipline(d)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[12px]",
                    form.disciplines.includes(d) ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-[#E5E7EB] text-[#6B7280]"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button onClick={save} disabled={saving} className="h-9 w-full rounded-md bg-[#2563EB] text-[12px] font-medium text-white disabled:opacity-60">
            {saving ? "Creating" : "Create change"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}