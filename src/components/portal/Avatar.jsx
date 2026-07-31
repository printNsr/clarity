import React from "react";

export default function Avatar({ name = "?" }) {
  const initials = name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-[11px] font-medium">
      {initials}
    </span>
  );
}