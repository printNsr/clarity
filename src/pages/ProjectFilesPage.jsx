import React, { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import FileUploadCard from "@/components/clarity/files/FileUploadCard";
import FileCard from "@/components/clarity/files/FileCard";

export default function ProjectFilesPage() {
  const { project } = useClarity();
  const [files, setFiles] = useState([]);

  const load = useCallback(async () => {
    if (!project) return;
    setFiles(await base44.entities.ProjectFile.filter({ project_id: project.id }, "-created_date", 200));
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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Project files</h1>
        <p className="text-[12px] text-[#6B7280]">
          One place for the project paperwork. Clarity reads these files and refers to them when it checks a change for collisions.
        </p>
      </div>

      <FileUploadCard projectId={project?.id} onUploaded={load} />

      {files.length === 0 ? (
        <p className="text-[12px] text-[#6B7280]">No files yet. Upload the specs and reports the team works from.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {files.map((f) => <FileCard key={f.id} file={f} onToggle={toggle} onDelete={remove} />)}
        </div>
      )}
    </div>
  );
}