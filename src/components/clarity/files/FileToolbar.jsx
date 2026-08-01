import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileToolbar({ categories, active, onSelect, query, onQuery, counts }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search files and summaries"
          className="h-9 w-[260px] rounded-md border border-[#E5E7EB] bg-white pl-8 pr-2.5 text-[12px] outline-none focus:border-[#7C3AED]"
        />
      </div>
      {["All", ...categories].map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={cn(
            "h-9 rounded-md border px-3 text-[12px] font-medium transition-colors",
            active === c ? "border-[#7C3AED] bg-[#7C3AED] text-white" : "border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]",
          )}
        >
          {c} <span className="opacity-70">{counts[c] || 0}</span>
        </button>
      ))}
    </div>
  );
}