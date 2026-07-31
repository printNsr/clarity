import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useClarity } from "@/components/clarity/ClarityLayout";
import MetricCards from "@/components/clarity/dashboard/MetricCards";
import HotspotsCard from "@/components/clarity/dashboard/HotspotsCard";
import DisciplineDonut from "@/components/clarity/dashboard/DisciplineDonut";
import RecentActivity from "@/components/clarity/dashboard/RecentActivity";
import ActivityTimeline from "@/components/clarity/dashboard/ActivityTimeline";
import NewChangeDialog from "@/components/clarity/changes/NewChangeDialog";
import { loadSampleWorkspace } from "@/components/clarity/sampleWorkspace";

const OPEN_STATES = ["Open", "Potential Collision", "Decision Recorded", "RFI Sent", "Drawing Updated", "Invalidated"];

export default function ClarityDashboard() {
  const { project, refresh } = useClarity();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!project) { setLoading(false); return; }
    const [is, evs] = await Promise.all([
      base44.entities.ChangeIssue.filter({ project_id: project.id }, "-created_date", 200),
      base44.entities.WorkflowEvent.filter({ project_id: project.id }, "-occurred_at", 20),
    ]);
    setIssues(is);
    setEvents(evs);
    setLoading(false);
  }, [project]);

  useEffect(() => { load(); }, [load]);

  const metrics = useMemo(() => {
    const today = new Date().toDateString();
    return [
      { key: "open", label: "Open Changes", value: issues.filter((i) => OPEN_STATES.includes(i.status)).length, color: "text-[#1F2937]" },
      { key: "collisions", label: "Collisions", value: issues.filter((i) => i.status === "Potential Collision").length, color: "text-[#EF4444]" },
      { key: "awaiting", label: "Awaiting Decisions", value: issues.filter((i) => ["Open", "Potential Collision"].includes(i.status)).length, color: "text-[#F59E0B]" },
      { key: "resolved", label: "Resolved Today", value: issues.filter((i) => i.status === "Verified" && new Date(i.updated_date).toDateString() === today).length, color: "text-[#16A34A]" },
    ];
  }, [issues]);

  const shownEvents = filter === "collisions" ? events.filter((e) => e.event_type === "collision_detected") : events;

  const seed = async () => {
    setSeeding(true);
    await loadSampleWorkspace();
    await refresh();
    setSeeding(false);
  };

  if (!loading && !project) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-[10px] border border-[#E5E7EB] bg-white p-8 text-center">
        <p className="text-[14px] font-semibold">No active project data yet.</p>
        <p className="mt-1 text-[12px] text-[#6B7280]">Create a project or load the sample workspace to explore Clarity.</p>
        <button onClick={seed} disabled={seeding} className="mt-4 h-9 rounded-md bg-[#2563EB] px-4 text-[12px] font-medium text-white disabled:opacity-60">
          {seeding ? "Loading" : "Load Sample Workspace"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold">Dashboard</h1>
        <NewChangeDialog project={project} onCreated={load} />
      </div>

      <MetricCards
        metrics={metrics}
        active={filter}
        onSelect={(key) => {
          if (key === "collisions") setFilter(filter === "collisions" ? null : "collisions");
          else navigate(key === "resolved" ? "/changes" : "/changes");
        }}
      />

      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <HotspotsCard issues={issues} />
        <DisciplineDonut issues={issues} />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <RecentActivity events={shownEvents.slice(0, 6)} />
        <ActivityTimeline events={events.slice(0, 6)} />
      </div>
    </div>
  );
}