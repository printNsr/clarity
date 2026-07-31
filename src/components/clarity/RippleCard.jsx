import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Card shell that lifts on hover and shows a soft yellow ripple that follows the cursor.
export default function RippleCard({ className, children, ...rest }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [on, setOn] = useState(false);

  const move = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={move}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      className={cn(
        "relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_hsl(var(--accent)/0.55)]",
        className
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: on ? 1 : 0,
          background: `radial-gradient(${on ? "220px" : "0px"} circle at ${pos.x}% ${pos.y}%, hsl(var(--accent) / 0.22), transparent 70%)`,
          transition: "opacity 300ms ease-out, background 200ms ease-out",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}