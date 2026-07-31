import React from "react";
import { useNavigate } from "react-router-dom";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FlaggedPanel({ messages }) {
  const navigate = useNavigate();
  if (!messages.length) return null;
  return (
    <div className="rounded-2xl border border-accent bg-accent/10 p-5">
      <div className="flex items-center gap-2">
        <Flag className="h-4 w-4" />
        <h2 className="font-heading text-sm font-semibold">Messages that may affect an open decision</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {messages.map((m) => (
          <li key={m.id} className="flex items-start justify-between gap-4 rounded-xl bg-card p-4">
            <div className="min-w-0">
              <p className="text-sm">{m.text}</p>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                {m.author} in {m.channel}
              </p>
            </div>
            {m.change_id ? (
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => navigate(`/change/${m.change_id}`)}>
                Go to change
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}