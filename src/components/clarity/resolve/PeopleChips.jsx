import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export default function PeopleChips({ people, onChange }) {
  const [name, setName] = useState("");

  const add = () => {
    if (!name.trim()) return;
    onChange([...people, name.trim()]);
    setName("");
  };

  return (
    <div>
      <h3 className="text-[13px] font-semibold">People to involve</h3>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {people.map((p) => (
          <span key={p} className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-2 py-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F1F5F9] text-[10px] font-semibold">
              {p.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
            <span className="text-[12px]">{p}</span>
            <button onClick={() => onChange(people.filter((x) => x !== p))} className="text-[11px] text-[#6B7280] hover:text-[#EF4444]">×</button>
          </span>
        ))}
        <Popover>
          <PopoverTrigger className="inline-flex items-center gap-1 rounded-full border border-dashed border-[#CBD5E1] px-2.5 py-1.5 text-[12px] text-[#2563EB]">
            <Plus className="h-3 w-3" /> Add
          </PopoverTrigger>
          <PopoverContent className="w-60 space-y-2 p-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="h-8 text-[12px]" />
            <button onClick={add} className="h-8 w-full rounded-md bg-[#2563EB] text-[12px] text-white">Add person</button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}