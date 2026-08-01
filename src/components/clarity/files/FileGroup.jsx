import React from "react";
import FileCard from "./FileCard";

export default function FileGroup({ title, files, onToggle, onDelete }) {
  if (!files.length) return null;
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[#6B7280]">
        {title} · {files.length}
      </p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {files.map((f) => <FileCard key={f.id} file={f} onToggle={onToggle} onDelete={onDelete} />)}
      </div>
    </div>
  );
}