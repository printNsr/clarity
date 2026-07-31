import React, { useState } from "react";
import { Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DISCIPLINE_NAMES } from "../disciplines";

const CLASSES = ["Stated", "Inferred", "Missing", "Confirmed", "Contradicted"];

export default function AddEvidenceDialog({ issue, onAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ text: "", discipline: "Electrical", classification: "Stated", source_user: "", element: "", fact_group: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.text.trim()) return;
    setSaving(true);
    await base44.entities.EvidenceFact.create({ ...form, issue_id: issue.id, source_time: new Date().toISOString() });
    setSaving(false);
    setOpen(false);
    setForm({ ...form, text: "", notes: "" });
    onAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#E5E7EB] bg-white px-3 text-[12px] font-medium hover:bg-[#F8FAFC]">
        <Plus className="h-3.5 w-3.5" /> Add Evidence
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="text-[15px]">Add evidence</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Textarea value={form.text} onChange={(e) => set("text", e.target.value)} placeholder="Fact or claim" className="text-[13px]" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.discipline} onChange={(e) => set("discipline", e.target.value)} className="h-9 rounded-md border border-[#E5E7EB] px-2 text-[13px]">
              {DISCIPLINE_NAMES.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={form.classification} onChange={(e) => set("classification", e.target.value)} className="h-9 rounded-md border border-[#E5E7EB] px-2 text-[13px]">
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Input value={form.source_user} onChange={(e) => set("source_user", e.target.value)} placeholder="Source person" className="h-9 text-[13px]" />
            <Input value={form.element} onChange={(e) => set("element", e.target.value)} placeholder="Building element" className="h-9 text-[13px]" />
            <Input value={form.fact_group} onChange={(e) => set("fact_group", e.target.value)} placeholder="Fact group" className="col-span-2 h-9 text-[13px]" />
          </div>
          <button onClick={save} disabled={saving} className="h-9 w-full rounded-md bg-[#2563EB] text-[12px] font-medium text-white disabled:opacity-60">
            {saving ? "Saving" : "Save evidence"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}