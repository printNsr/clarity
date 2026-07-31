import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import { Input } from "@/components/ui/input";
import { loadSampleWorkspace, resetSampleWorkspace } from "@/components/clarity/sampleWorkspace";
import { useToast } from "@/components/ui/use-toast";

export default function ClaritySettingsPage() {
  const { project, refresh } = useClarity();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", location: "", stage: "" });

  const createProject = async () => {
    if (!form.name.trim()) return;
    setBusy(true);
    await base44.entities.Project.create(form);
    setForm({ name: "", code: "", location: "", stage: "" });
    await refresh();
    setBusy(false);
    toast({ title: "Project created" });
  };

  const reset = async () => {
    if (!window.confirm("Replace all current data with a fresh sample workspace?")) return;
    setBusy(true);
    await resetSampleWorkspace();
    await refresh();
    setBusy(false);
    toast({ title: "Sample workspace reset" });
  };

  const load = async () => {
    setBusy(true);
    await loadSampleWorkspace();
    await refresh();
    setBusy(false);
    toast({ title: "Sample workspace loaded" });
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-[22px] font-semibold">Settings</h1>

      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
        <p className="text-[14px] font-semibold">New project</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project name" className="h-9 text-[13px]" />
          <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Project code" className="h-9 text-[13px]" />
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="h-9 text-[13px]" />
          <Input value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} placeholder="Stage" className="h-9 text-[13px]" />
        </div>
        <button onClick={createProject} disabled={busy} className="mt-3 h-9 rounded-md bg-[#2563EB] px-4 text-[12px] font-medium text-white disabled:opacity-60">
          Create project
        </button>
      </div>

      <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
        <p className="text-[14px] font-semibold">Sample data</p>
        <p className="mt-1 text-[12px] text-[#6B7280]">Current project: {project?.name || "none"}</p>
        <div className="mt-3 flex gap-2">
          <button onClick={load} disabled={busy} className="h-9 rounded-md border border-[#E5E7EB] px-4 text-[12px] font-medium hover:bg-[#F8FAFC] disabled:opacity-60">
            Load Sample Workspace
          </button>
          <button onClick={reset} disabled={busy} className="h-9 rounded-md border border-[#EF4444] px-4 text-[12px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] disabled:opacity-60">
            Reset Sample Data
          </button>
        </div>
      </div>
    </div>
  );
}