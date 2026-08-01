import React from "react";
import { Database } from "lucide-react";

function kb(chars) {
  return `${(chars / 1024).toFixed(1)} KB`;
}

export default function AiStorageCard({ logs }) {
  const byFeature = logs.reduce((acc, l) => {
    const f = acc[l.feature] || { runs: 0, chars: 0 };
    f.runs += 1;
    f.chars += l.output_chars || 0;
    acc[l.feature] = f;
    return acc;
  }, {});
  const total = logs.reduce((s, l) => s + (l.output_chars || 0), 0);
  const rows = Object.entries(byFeature).sort((a, b) => b[1].chars - a[1].chars);

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-[#7C3AED]" />
        <p className="text-[14px] font-semibold">Stored AI outputs</p>
      </div>
      <p className="mt-1 text-[12px] text-[#6B7280]">
        Everything the AI has written and saved for this workspace. Total {kb(total)} across {logs.length} runs.
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-[12px] text-[#6B7280]">Nothing stored yet. Run an AI tool and it will show here.</p>
      ) : (
        <div className="mt-3 divide-y divide-[#F1F5F9]">
          {rows.map(([feature, v]) => (
            <div key={feature} className="flex items-center justify-between py-2 text-[12px]">
              <span className="font-medium">{feature}</span>
              <span className="text-[#6B7280]">{v.runs} runs · {kb(v.chars)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}