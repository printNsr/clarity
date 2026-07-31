import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import ThemeToggle from "@/components/ThemeToggle";

const LOGO = "https://media.base44.com/images/public/6a6c3fe05c7bc26e77fa1781/f1070b638_ChatGPTImageJul30202605_08_20PM.png";

const links = [
  { to: "/", label: "Inbox", end: true },
  { to: "/timeline", label: "Decision Timeline" },
  { to: "/portal", label: "Team Portal" },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2.5">
            <Image src={LOGO} alt="Clarity" className="h-9 w-9 rounded-xl bg-black" fittingType="fit" />
            <span className="font-heading text-lg font-semibold tracking-tight">
              Clarity<span className="text-accent">.</span>
            </span>
          </NavLink>
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-3 py-1.5 text-sm transition-colors",
                    isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}