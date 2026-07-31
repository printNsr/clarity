import React from "react";
import Pill from "./Pill";

const tone = { High: "low", Medium: "med", Low: "high" };

export default function ConfidenceTag({ level = "Medium", source }) {
  return (
    <span className="inline-flex items-center gap-2">
      <Pill tone={tone[level] || "neutral"}>AI draft, confidence {level}</Pill>
      {source ? <span className="font-mono text-[11px] text-muted-foreground">from {source}</span> : null}
    </span>
  );
}