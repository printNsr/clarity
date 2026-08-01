import React, { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import FileUploadCard from "@/components/clarity/files/FileUploadCard";
import FileToolbar from "@/components/clarity/files/FileToolbar";
import FileGroup from "@/components/clarity/files/FileGroup";

const CATEGORIES = ["Drawing", "Specification", "Report", "Contract", "Photo", "Meeting notes", "Other"];

export default function ProjectFilesPage() {
  const { project } = useClarity();
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    if (!project) return;
    setFiles(await base44.entities.ProjectFile.filter({ project_id: project.id }, "-created_date", 300));
  }, [project]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (file) => {
    await base44.entities.ProjectFile.update(file.id, { use_in_analysis: !file.use_in_analysis });
    load();
  };

  const remove = async (file) => {
    if (!window.confirm(`Remove ${file.name}?`)) return;
    await base44.entities.ProjectFile.delete(file.id);
    load();
  };

  const counts = useMemo(() => {
    const c = { All: files.length };
    CATEGORIES.forEach((k) => { c[k] = files.filter((f) => f.category === k).length; });
    return c;
  }, [files]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return files.filter((f) => {
      if (category !== "All" && f.category !== category) return false;
      if (!q) return true;
      return [f.name, f.discipline, f.ai_summary, f.description].filter(Boolean).join(" ").toLowerCase().includes(q);
    });
  }, [files, category, query]);

  const usedCount = files.filter((f) => f.use_in_analysis).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Project files</h1>
        <p className="text-[12px] text-[#6B7280]">
          The project paperwork in one place, sorted by type. Clarity reads each file and refers to it when it checks a change
          for collisions and when you ask it a question. {usedCount} of {files.length} files are switched on for that.
        </p>
      </div>

      <FileUploadCard projectId={project?.id} onUploaded={load} />

      <FileToolbar
        categories={CATEGORIES}
        active={category}
        onSelect={setCategory}
        query={query}
        onQuery={setQuery}
        counts={counts}
      />

      {visible.length === 0 ? (
        <p className="text-[12px] text-[#6B7280]">
          {files.length ? "No files match that search." : "No files yet. Upload the specs and reports the team works from."}
        </p>
      ) : (
        <div className="space-y-5">
          {CATEGORIES.map((c) => (
            <FileGroup
              key={c}
              title={c}
              files={visible.filter((f) => f.category === c)}
              onToggle={toggle}
              onDelete={remove}
            />
          ))}
        </div>
      )}
    </div>
  );
}