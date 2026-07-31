import React, { useState } from "react";
import { Menu, Search, Bell, ChevronDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function TopBar({ projects = [], project, onSelectProject, notifications = [], onToggleRail }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-[58px] items-center gap-3 border-b border-[#E5E7EB] bg-white px-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1F2937] text-xs font-bold text-white">C</span>
        <span className="text-[15px] font-semibold text-[#1F2937]">Clarity</span>
      </div>

      <button onClick={onToggleRail} title="Menu" className="ml-2 rounded-md p-1.5 text-[#6B7280] hover:bg-[#F8FAFC] md:hidden">
        <Menu className="h-4 w-4" />
      </button>

      <Popover>
        <PopoverTrigger className="ml-2 flex items-center gap-1.5 rounded-md border border-[#E5E7EB] px-2.5 py-1.5 text-[12px] text-[#1F2937] hover:bg-[#F8FAFC]">
          Project: {project?.name || "Select project"}
          <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-1">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-[#F8FAFC]"
            >
              {p.name}
              {p.id === project?.id ? <Check className="h-3.5 w-3.5 text-[#2563EB]" /> : null}
            </button>
          ))}
          {projects.length === 0 ? <p className="px-2 py-1.5 text-[12px] text-[#6B7280]">No projects yet.</p> : null}
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex items-center gap-1">
        <Popover>
          <PopoverTrigger title="Search" className="rounded-md p-2 text-[#6B7280] hover:bg-[#F8FAFC]">
            <Search className="h-4 w-4" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search changes, RFIs, drawings" className="h-8 text-[12px]" />
            <SearchResults q={q} navigate={navigate} />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger title="Notifications" className="relative rounded-md p-2 text-[#6B7280] hover:bg-[#F8FAFC]">
            <Bell className="h-4 w-4" />
            {notifications.length ? <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#EF4444]" /> : null}
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-1">
            {notifications.length === 0 ? (
              <p className="px-2 py-2 text-[12px] text-[#6B7280]">Nothing new.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => n.issue_id && navigate(`/changes/${n.issue_id}`)}
                  className="block w-full rounded-md px-2 py-2 text-left hover:bg-[#F8FAFC]"
                >
                  <p className="text-[12px] font-medium text-[#1F2937]">{n.title}</p>
                  <p className="text-[11px] text-[#6B7280]">{n.description}</p>
                </button>
              ))
            )}
          </PopoverContent>
        </Popover>

        <span className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#E5E7EB] text-[11px] font-semibold text-[#1F2937]">AA</span>
      </div>
    </header>
  );
}

function SearchResults({ q, navigate }) {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    let active = true;
    if (!q) return setItems([]);
    (async () => {
      const { base44 } = await import("@/api/base44Client");
      const [changes, rfis, drawings] = await Promise.all([
        base44.entities.ChangeIssue.list("-created_date", 50),
        base44.entities.RFI.list("-created_date", 50),
        base44.entities.Drawing.list("-created_date", 50),
      ]);
      const term = q.toLowerCase();
      const out = [
        ...changes.filter((c) => c.title?.toLowerCase().includes(term)).map((c) => ({ id: c.id, label: c.title, kind: "Change", to: `/changes/${c.id}` })),
        ...rfis.filter((r) => `${r.rfi_number} ${r.title}`.toLowerCase().includes(term)).map((r) => ({ id: r.id, label: `${r.rfi_number} ${r.title || ""}`, kind: "RFI", to: `/rfis/${r.id}` })),
        ...drawings.filter((d) => `${d.drawing_number} ${d.title}`.toLowerCase().includes(term)).map((d) => ({ id: d.id, label: `${d.drawing_number} ${d.title || ""}`, kind: "Drawing", to: `/drawings/${d.id}/update` })),
      ].slice(0, 8);
      if (active) setItems(out);
    })();
    return () => { active = false; };
  }, [q]);

  if (!q) return null;
  if (!items.length) return <p className="px-2 py-2 text-[12px] text-[#6B7280]">No matches.</p>;
  return (
    <div className="mt-1">
      {items.map((i) => (
        <button key={i.kind + i.id} onClick={() => navigate(i.to)} className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[12px] hover:bg-[#F8FAFC]">
          <span className="truncate text-[#1F2937]">{i.label}</span>
          <span className="ml-2 text-[11px] text-[#6B7280]">{i.kind}</span>
        </button>
      ))}
    </div>
  );
}