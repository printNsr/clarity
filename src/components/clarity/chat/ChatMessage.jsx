import React from "react";
import { Sparkles } from "lucide-react";

export default function ChatMessage({ message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-[10px] bg-[#2563EB] px-3 py-2 text-[12px] leading-relaxed text-white">{message.text}</p>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Sparkles className="mt-1 h-3.5 w-3.5 shrink-0 text-[#F59E0B]" />
      <div className="min-w-0">
        <p className="whitespace-pre-wrap text-[12px] leading-relaxed">{message.text}</p>
        {message.sources?.length ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {message.sources.map((s, n) => (
              <span key={n} className="rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-2 py-0.5 text-[10px] text-[#6B7280]">{s}</span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}