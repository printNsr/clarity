import React from "react";
import { NavLink } from "react-router-dom";
import { Home, GitPullRequestArrow, TriangleAlert, FileQuestion, Layers, Bell, Building2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/changes", icon: GitPullRequestArrow, label: "Changes" },
  { to: "/collisions", icon: TriangleAlert, label: "Collisions" },
  { to: "/rfis", icon: FileQuestion, label: "RFIs" },
  { to: "/drawings", icon: Layers, label: "Drawings" },
  { to: "/updates", icon: Bell, label: "Updates" },
  { to: "/organisation", icon: Building2, label: "Organisation" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function NavRail({ open }) {
  return (
    <nav className={cn("w-[52px] shrink-0 border-r border-border bg-card/70 py-3 backdrop-blur-md", open ? "block" : "hidden md:block")}>
      <div className="flex flex-col items-center gap-1">
        {ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              cn("flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", isActive && "bg-accent text-accent-foreground")
            }
          >
            <Icon className="h-[18px] w-[18px]" />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}