import React from "react";
import { NavLink } from "react-router-dom";
import { Home, GitPullRequestArrow, TriangleAlert, FileQuestion, Layers, Bell, BookOpen, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/changes", icon: GitPullRequestArrow, label: "Changes" },
  { to: "/collisions", icon: TriangleAlert, label: "Collisions" },
  { to: "/rfis", icon: FileQuestion, label: "RFIs" },
  { to: "/drawings", icon: Layers, label: "Drawings" },
  { to: "/updates", icon: Bell, label: "Updates" },
  { to: "/guide", icon: BookOpen, label: "Guide" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function NavRail({ open }) {
  return (
    <nav className={cn("w-[52px] shrink-0 border-r border-[#E5E7EB] bg-white py-3", open ? "block" : "hidden md:block")}>
      <div className="flex flex-col items-center gap-1">
        {ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              cn("flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F8FAFC]", isActive && "bg-[#F1F5F9] text-[#1F2937]")
            }
          >
            <Icon className="h-[18px] w-[18px]" />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}