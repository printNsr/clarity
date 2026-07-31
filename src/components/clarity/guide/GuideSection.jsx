import React from "react";

export default function GuideSection({ step, title, children }) {
  return (
    <section className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2">
        {step ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EFF6FF] text-[12px] font-semibold text-[#2563EB]">
            {step}
          </span>
        ) : null}
        <h2 className="text-[14px] font-semibold">{title}</h2>
      </div>
      <div className="mt-2 space-y-2 text-[13px] leading-relaxed text-[#374151]">{children}</div>
    </section>
  );
}