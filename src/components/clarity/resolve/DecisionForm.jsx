import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const RESOLUTIONS = [
  "Move cable tray",
  "Move AHU duct",
  "Reposition wall",
  "Escalate for engineering review",
  "Request additional survey information",
];

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wide text-[#6B7280]">{label}</span>
      {children}
    </label>
  );
}

export default function DecisionForm({ form, onChange, onRecord, onSaveDraft, saving }) {
  const set = (k, v) => onChange({ ...form, [k]: v });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Decision">
          <select value={form.resolution} onChange={(e) => set("resolution", e.target.value)} className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-2 text-[13px]">
            {[...new Set([form.resolution, ...RESOLUTIONS].filter(Boolean))].map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Reason">
          <Textarea value={form.reason} onChange={(e) => set("reason", e.target.value)} className="min-h-[38px] text-[13px]" />
        </Field>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Due Date">
          <Input type="date" value={form.due_date || ""} onChange={(e) => set("due_date", e.target.value)} className="h-9 text-[13px]" />
        </Field>
        <Field label="Owner">
          <Input value={form.owner || ""} onChange={(e) => set("owner", e.target.value)} className="h-9 text-[13px]" />
        </Field>
        <Field label="Priority">
          <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className="h-9 w-full rounded-md border border-[#E5E7EB] bg-white px-2 text-[13px]">
            {["High", "Medium", "Low"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onRecord} disabled={saving} className="h-9 rounded-md bg-[#2563EB] px-4 text-[12px] font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-60">
          Record Decision
        </button>
        <button onClick={onSaveDraft} disabled={saving} className="h-9 rounded-md border border-[#E5E7EB] bg-white px-4 text-[12px] font-medium hover:bg-[#F8FAFC] disabled:opacity-60">
          Save Draft
        </button>
      </div>
    </div>
  );
}