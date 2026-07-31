import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import TopBar from "./TopBar";
import NavRail from "./NavRail";

const ClarityContext = createContext({ project: null, projects: [], refresh: () => {} });
export const useClarity = () => useContext(ClarityContext);

export default function ClarityLayout() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [railOpen, setRailOpen] = useState(false);

  const refresh = useCallback(async () => {
    const [ps, events] = await Promise.all([
      base44.entities.Project.filter({ archived: false }, "-created_date"),
      base44.entities.WorkflowEvent.list("-occurred_at", 5),
    ]);
    setProjects(ps);
    setProject((cur) => ps.find((p) => p.id === cur?.id) || ps[0] || null);
    setNotifications(events);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <ClarityContext.Provider value={{ project, projects, refresh, setProject }}>
      <div className="min-h-screen bg-[#F8FAFC] font-body text-[#1F2937]">
        <TopBar
          projects={projects}
          project={project}
          onSelectProject={setProject}
          notifications={notifications}
          onToggleRail={() => setRailOpen((o) => !o)}
        />
        <div className="flex min-h-[calc(100vh-58px)]">
          <NavRail open={railOpen} />
          <main className="min-w-0 flex-1 p-5">
            <Outlet />
          </main>
        </div>
      </div>
    </ClarityContext.Provider>
  );
}