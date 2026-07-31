import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { DISCIPLINE_NAMES, disc } from "../disciplines";
import RippleCard from "../RippleCard";

export default function DisciplineDonut({ issues }) {
  const data = DISCIPLINE_NAMES.map((name) => ({
    name,
    value: issues.filter((i) => (i.disciplines || []).includes(name)).length,
  })).filter((d) => d.value > 0);

  const total = issues.length;

  return (
    <RippleCard className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <h2 className="text-[14px] font-semibold">By Discipline</h2>
      <div className="mt-2 flex items-center gap-3">
        <div className="relative h-[150px] w-[150px] shrink-0">
          {data.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="none">
                  {data.map((d) => (
                    <Cell key={d.name} fill={disc(d.name).hex} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-full border border-dashed border-[#E5E7EB] text-[11px] text-[#6B7280]">No data</div>
          )}
          {data.length ? (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[24px] font-semibold">{total}</span>
          ) : null}
        </div>
        <ul className="space-y-1.5 text-[12px]">
          {DISCIPLINE_NAMES.map((name) => (
            <li key={name} className="flex items-center gap-2 text-[#6B7280]">
              <span className="h-2 w-2 rounded-full" style={{ background: disc(name).hex }} />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </RippleCard>
  );
}