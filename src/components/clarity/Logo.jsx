import React from "react";
import { cn } from "@/lib/utils";

/** Clarity mark drawn in code: a broken ring with a four point star inside. */
export default function Logo({ className }) {
  return (
    <span className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-black", className)}>
      <svg viewBox="0 0 100 100" className="h-[78%] w-[78%]" aria-label="Clarity logo" role="img">
        {/* ring, broken at the top and bottom */}
        <g fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round">
          <path d="M58.7 8.9 A42 42 0 0 1 91.1 41.3" />
          <path d="M91.1 58.7 A42 42 0 0 1 58.7 91.1" />
          <path d="M41.3 91.1 A42 42 0 0 1 8.9 58.7" />
          <path d="M8.9 41.3 A42 42 0 0 1 41.3 8.9" />
        </g>
        {/* four point star */}
        <path
          d="M50 14 C53 36 64 47 86 50 C64 53 53 64 50 86 C47 64 36 53 14 50 C36 47 47 36 50 14 Z"
          fill="#FACC15"
        />
      </svg>
    </span>
  );
}