import React from "react";
import { cn } from "@/lib/utils";

export default function DisciplineChip({ name, active = false, onClick, className }) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card text-foreground hover:bg-muted",
        className
      )}
    >
      {name}
    </Tag>
  );
}