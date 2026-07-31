import React, { useState } from "react";
import { Flag, CornerDownRight, Smile } from "lucide-react";
import Avatar from "./Avatar";
import { Input } from "@/components/ui/input";
import Pill from "@/components/common/Pill";

export default function MessageItem({ message, replies, onFlag, onReact, onReply }) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");

  const submit = async () => {
    if (!text.trim()) return;
    await onReply(message.id, text);
    setText("");
    setReplying(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex gap-3">
        <Avatar name={message.author} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{message.author}</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {new Date(message.created_date).toLocaleString()}
            </span>
            {message.flagged ? <Pill tone="med">may affect an open decision</Pill> : null}
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm">{message.text}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-muted-foreground">
            <button onClick={() => onReact(message)} className="flex items-center gap-1 text-xs hover:text-foreground">
              <Smile className="h-3.5 w-3.5" />
              {(message.reactions || []).reduce((n, r) => n + (r.count || 0), 0) || "React"}
            </button>
            <button onClick={() => setReplying(!replying)} className="flex items-center gap-1 text-xs hover:text-foreground">
              <CornerDownRight className="h-3.5 w-3.5" /> Reply
            </button>
            <button onClick={() => onFlag(message)} className="flex items-center gap-1 text-xs hover:text-foreground">
              <Flag className="h-3.5 w-3.5" /> {message.flagged ? "Remove flag" : "Flag for a decision"}
            </button>
          </div>

          {replies.length ? (
            <div className="mt-4 space-y-3 border-l border-border pl-4">
              {replies.map((r) => (
                <div key={r.id} className="flex gap-3">
                  <Avatar name={r.author} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{r.author}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {new Date(r.created_date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {replying ? (
            <div className="mt-3">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Write a reply and press enter"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}