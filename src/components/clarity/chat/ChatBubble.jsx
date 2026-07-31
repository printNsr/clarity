import React, { useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ChatMessage from "./ChatMessage";

const STARTERS = [
  "What needs a decision today?",
  "Which collisions are still unresolved?",
  "Summarise this week's activity",
];

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [messages, busy]);

  const ask = async (question) => {
    if (!question.trim() || busy) return;
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((m) => [...m, { role: "user", text: question }]);
    setText("");
    setBusy(true);
    try {
      const res = await base44.functions.invoke("clarityChat", { question, history });
      if (res.data?.error) throw new Error(res.data.error);
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer, sources: res.data.sources }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "I could not reach the project records just now. Please try again." }]);
    }
    setBusy(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-[#2563EB] px-4 text-[12px] font-medium text-white shadow-lg hover:bg-[#1D4ED8]"
      >
        <MessageSquare className="h-4 w-4" /> Ask Clarity
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex h-[520px] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col rounded-[12px] border border-[#E5E7EB] bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#F1F5F9] px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#F59E0B]" />
          <p className="text-[13px] font-semibold">Ask Clarity</p>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close chat">
          <X className="h-4 w-4 text-[#6B7280] hover:text-[#1F2937]" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <>
            <p className="text-[12px] leading-relaxed text-[#6B7280]">
              Ask anything about the projects, changes, collisions, decisions, RFIs, drawings or site updates. Answers come from the live project records.
            </p>
            <div className="space-y-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-left text-[12px] hover:bg-[#F8FAFC]"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        ) : (
          messages.map((m, n) => <ChatMessage key={n} message={m} />)
        )}
        {busy ? (
          <p className="flex items-center gap-2 text-[12px] text-[#6B7280]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Reading the project records
          </p>
        ) : null}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(text); }}
        className="flex items-center gap-2 border-t border-[#F1F5F9] px-3 py-2.5"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about anything in the business"
          className="h-9 min-w-0 flex-1 rounded-md border border-[#E5E7EB] bg-white px-2.5 text-[12px] outline-none focus:border-[#2563EB]"
        />
        <button type="submit" disabled={busy || !text.trim()} className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#2563EB] text-white disabled:opacity-50">
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}