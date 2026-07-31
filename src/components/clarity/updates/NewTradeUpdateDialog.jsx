import React, { useState } from "react";
import { Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DISCIPLINE_NAMES } from "@/components/clarity/disciplines";

const KINDS = ["Progress update", "Delay notice", "Site condition", "Material change", "Question", "Sign off"];
const EMPTY = { discipline: "Electrical", rep_name: "", company: "", title: "", body: "", kind: "Progress update", urgency: "Medium" };

export default function NewTradeUpdateDialog({ project, onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title.trim() || !form.rep_name.trim()) return;
    setSaving(true);
    await base44.entities.TradeUpdate.create({
      ...form,
      project_id: project?.id,
      posted_at: new Date().toISOString(),
      acknowledged: false,
    });
    setSaving(false);
    setForm(EMPTY);
    setOpen(false);
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2563EB] px-3 text-[12px] font-medium text-white hover:bg-[#1D4ED8]">
        <Plus className="h-3.5 w-3.5" /> Post Update
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-[15px]">Post a trade update</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <select value={form.discipline} onChange={(e) => setForm({ ...form, discipline: e.target.value })} className="h-9 rounded-md border border-[#E5E7EB] px-2 text-[13px]">
              {DISCIPLINE_NAMES.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className="h-9 rounded-md border border-[#E5E7EB] px-2 text-[13px]">
              {KINDS.map((k) => <option key={k}>{k}</option>)}
            </select>
            <Input value={form.rep_name} onChange={(e) => setForm({ ...form, rep_name: e.target.value })} placeholder="Rep name" className="h-9 text-[13px]" />
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="h-9 text-[13px]" />
          </div>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Update title" className="h-9 text-[13px]" />
          <Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="What is happening on site?" className="text-[13px]" />
          <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className="h-9 w-full rounded-md border border-[#E5E7EB] px-2 text-[13px]">
            {["High", "Medium", "Low"].map((u) => <option key={u} value={u}>{u} urgency</option>)}
          </select>
          <button onClick={save} disabled={saving} className="h-9 w-full rounded-md bg-[#2563EB] text-[12px] font-medium text-white disabled:opacity-60">
            {saving ? "Posting" : "Post update"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}