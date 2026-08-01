import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";

const FIELDS = [
  ["name", "Organisation name"],
  ["abn", "ABN"],
  ["industry", "Industry"],
  ["address", "Address"],
  ["contact_name", "Main contact"],
  ["contact_email", "Contact email"],
  ["phone", "Phone"],
];

export default function OrgProfileCard({ org, onSaved }) {
  const { toast } = useToast();
  const [form, setForm] = useState(org || { name: "" });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!form.name?.trim()) return;
    setBusy(true);
    const saved = org?.id
      ? await base44.entities.Organisation.update(org.id, form)
      : await base44.entities.Organisation.create(form);
    setBusy(false);
    toast({ title: "Organisation saved" });
    onSaved?.(saved);
  };

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-[#6B7280]" />
        <p className="text-[14px] font-semibold">Organisation profile</p>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {FIELDS.map(([key, label]) => (
          <Input
            key={key}
            value={form[key] || ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={label}
            className="h-9 text-[13px]"
          />
        ))}
      </div>
      <button
        onClick={save}
        disabled={busy}
        className="mt-3 h-9 rounded-md bg-[#2563EB] px-4 text-[12px] font-medium text-white disabled:opacity-60"
      >
        Save details
      </button>
    </div>
  );
}