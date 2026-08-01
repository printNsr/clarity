import React from "react";
import { FileText, Trash2 } from "lucide-react";
import StatusBadge from "@/components/clarity/StatusBadge";

export default function FileCard({ file, onToggle, onDelete }) {
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7280]" />
          <div className="min-w-0">
            <a href={file.file_url} target="_blank" rel="noreferrer" className="block truncate text-[13px] font-medium hover:underline">
              {file.name}
            </a>
            <p className="mt-0.5 text-[11px] text-[#6B7280]">
              {file.category}{file.discipline ? ` · ${file.discipline}` : ""}
            </p>
          </div>
        </div>
        <button onClick={() => onDelete(file)} aria-label="Delete file">
          <Trash2 className="h-3.5 w-3.5 text-[#9CA3AF] hover:text-[#EF4444]" />
        </button>
      </div>

      {file.ai_summary ? (
        <p className="mt-2 line-clamp-4 text-[11px] leading-relaxed text-[#6B7280]">{file.ai_summary}</p>
      ) : (
        <p className="mt-2 text-[11px] text-[#9CA3AF]">No summary was read from this file.</p>
      )}

      <button
        onClick={() => onToggle(file)}
        className="mt-3 inline-flex items-center gap-2 text-[11px] font-medium"
      >
        <StatusBadge tone={file.use_in_analysis ? "green" : "grey"}>
          {file.use_in_analysis ? "Used in collision checks" : "Not used in checks"}
        </StatusBadge>
      </button>
    </div>
  );
}