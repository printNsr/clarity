import React, { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AudioMessage from "./AudioMessage";
import DisciplineIcon from "../DisciplineIcon";
import { fmtTime } from "../clarityApi";
import { Input } from "@/components/ui/input";

export default function DiscussionPanel({ issue, messages, onChange }) {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    await base44.entities.DiscussionMessage.create({
      issue_id: issue.id,
      author: "Alex Anderson",
      discipline: "Architecture",
      type: "text",
      text: text.trim(),
      sent_at: new Date().toISOString(),
    });
    setText("");
    setSaving(false);
    onChange();
  };

  const remove = async (id) => {
    await base44.entities.DiscussionMessage.delete(id);
    onChange();
  };

  return (
    <div className="flex h-full flex-col rounded-[10px] border border-[#E5E7EB] bg-[#F8FAFC] p-3">
      <h2 className="text-[14px] font-semibold">Discipline Discussion</h2>
      <div className="mt-2 flex-1 space-y-2.5">
        {messages.length === 0 ? <p className="text-[12px] text-[#6B7280]">No discussion yet.</p> : null}
        {messages.map((m) =>
          m.type === "audio" ? (
            <AudioMessage key={m.id} message={m} />
          ) : (
            <div key={m.id} className="group rounded-[10px] border border-[#E5E7EB] bg-white p-3">
              <div className="flex items-center gap-2">
                <DisciplineIcon name={m.discipline} size="sm" />
                <span className="text-[12px] font-medium">{m.author}</span>
                <span className="ml-auto text-[11px] text-[#6B7280]">{fmtTime(m.sent_at || m.created_date)}</span>
                <button onClick={() => remove(m.id)} title="Delete" className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5 text-[#6B7280] hover:text-[#EF4444]" />
                </button>
              </div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#1F2937]">{m.text}</p>
            </div>
          )
        )}
      </div>
      <form onSubmit={submit} className="mt-3 flex items-center gap-2 rounded-[10px] border border-[#E5E7EB] bg-white px-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="h-9 border-0 px-1 text-[12px] shadow-none focus-visible:ring-0"
        />
        <button type="submit" disabled={saving} className="text-[#2563EB] disabled:opacity-50">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}