import React from "react";
import { cn } from "@/lib/utils";
import { disc } from "./disciplines";

export default function DisciplineIcon({ name, size = "md", className }) {
  const d = disc(name);
  const sizes = { sm: "h-5 w-5 text-[10px]", md: "h-6 w-6 text-[11px]", lg: "h-8 w-8 text-sm" };
  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border font-semibold",
        d.soft, d.border, d.text, sizes[size], className
      )}
    >
      {d.code}
    </span>
  );
}