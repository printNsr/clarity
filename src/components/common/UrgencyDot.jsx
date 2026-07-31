import React from "react";
import { cn } from "@/lib/utils";

const map = { high: "bg-risk-high", med: "bg-risk-med", low: "bg-risk-low" };

export default function UrgencyDot({ level = "med", className }) {
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full", map[level] || map.med, className)} />;
}