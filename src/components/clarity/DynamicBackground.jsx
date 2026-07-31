import React, { useEffect, useState } from "react";

// Fixed background layer whose yellow and black tones blend and shift as you scroll.
export default function DynamicBackground() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      <div
        className="absolute -left-40 h-[70vh] w-[70vh] rounded-full blur-[120px] transition-transform duration-300 ease-out"
        style={{
          top: `${-10 + p * 55}%`,
          background: "radial-gradient(circle, hsl(var(--accent) / 0.55), transparent 70%)",
          transform: `translateY(${p * -60}px) scale(${1 + p * 0.25})`,
        }}
      />
      <div
        className="absolute -right-32 h-[60vh] w-[60vh] rounded-full blur-[130px] transition-transform duration-300 ease-out"
        style={{
          top: `${70 - p * 60}%`,
          background: "radial-gradient(circle, hsl(var(--accent) / 0.35), transparent 70%)",
          transform: `translateY(${p * 40}px)`,
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[60vh]"
        style={{
          opacity: 0.08 + p * 0.2,
          background: "linear-gradient(to top, hsl(var(--foreground) / 0.85), transparent)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.5,
          backgroundImage:
            "linear-gradient(hsl(var(--foreground) / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          backgroundPosition: `0 ${p * -80}px`,
        }}
      />
    </div>
  );
}