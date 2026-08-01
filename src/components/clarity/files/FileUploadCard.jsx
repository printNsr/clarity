import React, { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { logAiUsage } from "@/components/clarity/ai/logAiUsage";

const CATEGORIES = ["Drawing", "Specification", "Report", "Contract", "Photo", "Meeting notes", "Other"];

export default function FileUploadCard({ projectId, onUploaded }) {
  const inputRef = useRef(null);
  const [category, setCategory] = useState("Specification");
  const [discipline, setDiscipline] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setBusy("Uploading the file");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setBusy("Reading the file so Clarity can use it");
      let summary = "";
      try {
        const res = await base44.functions.invoke("summariseProjectFile", { file_url, name: file.name, category });
        summary = res.data?.summary || "";
        logAiUsage({ feature: "Plan Analyzer", project_id: projectId, reference: file.name, output: summary });
      } catch {
        summary = "";
      }
      const record = await base44.entities.ProjectFile.create({
        project_id: projectId,
        name: file.name,
        category,
        discipline: discipline || undefined,
        file_url,
        ai_summary: summary,
        use_in_analysis: true,
      });
      onUploaded?.(record);
    } catch {
      setError("That file could not be uploaded. Please try again.");
    }
    setBusy("");
  };

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <p className="text-[14px] font-semibold">Add a file</p>
      <p className="mt-1 text-[12px] text-[#6B7280]">
        Upload specs, reports, drawings or notes. Clarity reads each one and uses it when checking a change for collisions.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-md border border-[#E5E7EB] bg-white px-2 text-[12px]"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value)}
          placeholder="Discipline (optional)"
          className="h-9 w-[190px] rounded-md border border-[#E5E7EB] bg-white px-2.5 text-[12px] outline-none focus:border-[#7C3AED]"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={!!busy}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-[#7C3AED] px-4 text-[12px] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-md hover:shadow-[#7C3AED]/30 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {busy || "Upload file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ""; }}
        />
      </div>
      {error ? <p className="mt-2 text-[12px] text-[#EF4444]">{error}</p> : null}
    </div>
  );
}