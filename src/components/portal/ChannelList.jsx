import React from "react";
import { cn } from "@/lib/utils";
import Avatar from "./Avatar";

export default function ChannelList({ channels, active, onSelect, counts }) {
  return (
    <aside className="w-full shrink-0 space-y-1 sm:w-56">
      <p className="px-3 pb-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Channels</p>
      {channels.map((c) => (
        <button
          key={c.name}
          onClick={() => onSelect(c.name)}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
            active === c.name ? "bg-accent text-accent-foreground font-medium" : "hover:bg-muted"
          )}
        >
          <Avatar name={c.name.replace("#", "")} />
          <span className="min-w-0 flex-1 truncate">{c.name}</span>
          {counts[c.name] ? (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] text-background">{counts[c.name]}</span>
          ) : null}
        </button>
      ))}
    </aside>
  );
}