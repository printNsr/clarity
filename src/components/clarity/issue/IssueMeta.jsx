import React from "react";
import { MapPin, Layers, Users, Clock, CalendarDays } from "lucide-react";
import DisciplineIcon from "../DisciplineIcon";
import { fmtDate, fmtTime } from "../clarityApi";

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-2.5 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7280]" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-[#6B7280]">{label}</p>
        <div className="mt-0.5 text-[13px] text-[#1F2937]">{children}</div>
      </div>
    </div>
  );
}

export default function IssueMeta({ issue }) {
  return (
    <div className="divide-y divide-[#F1F5F9] rounded-[10px] border border-[#E5E7EB] bg-white px-4">
      <Row icon={MapPin} label="Location">{[issue.level, issue.zone].filter(Boolean).join(", ") || "Not set"}</Row>
      <Row icon={Layers} label="Stage">{issue.stage || "Not set"}</Row>
      <Row icon={Users} label="Discipline Impact">
        <div className="flex gap-1.5">
          {(issue.disciplines || []).map((d) => <DisciplineIcon key={d} name={d} size="sm" />)}
          {(issue.disciplines || []).length === 0 ? <span className="text-[#6B7280]">None</span> : null}
        </div>
      </Row>
      <Row icon={Clock} label="Change Created">{fmtTime(issue.created_date)}</Row>
      <Row icon={CalendarDays} label="Due Date">
        <span className="text-[#EF4444]">{fmtDate(issue.due_date) || "Not set"}</span>
      </Row>
      <Row icon={Users} label="Owner">
        <span className="block">{issue.owner || "Unassigned"}</span>
        <span className="block text-[11px] text-[#6B7280]">{issue.owner_role}</span>
      </Row>
    </div>
  );
}