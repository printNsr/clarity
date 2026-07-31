import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import EvidenceCard from "@/components/clarity/evidence/EvidenceCard";
import AddEvidenceDialog from "@/components/clarity/evidence/AddEvidenceDialog";
import DisciplineIcon from "@/components/clarity/DisciplineIcon";
import { DISCIPLINE_NAMES } from "@/components/clarity/disciplines";
import { cn } from "@/lib/utils";

export default function EvidencePage() {
  const { issueId } = useParams();
  const [issue, setIssue] = useState(null);
  const [facts, setFacts] = useState([]);
  const [tab, setTab] = useState("discipline");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    const [i, fs] = await Promise.all([
      base44.entities.ChangeIssue.get(issueId),
      base44.entities.EvidenceFact.filter({ issue_id: issueId }, "order"),
    ]);
    setIssue(i);
    setFacts(fs);
  }, [issueId]);

  useEffect(() => { load(); }, [load]);

  const remove = async (f) => { await base44.entities.EvidenceFact.delete(f.id); load(); };
  const confirm = async (f) => { await base44.entities.EvidenceFact.update(f.id, { classification: "Confirmed" }); load(); };

  const shown = selected ? facts.filter((f) => f.discipline === selected) : facts;
  const groups = [...new Set(facts.map((f) => f.fact_group || "Other"))];

  if (!issue) return <p className="text-[12px] text-[#6B7280]">Loading evidence</p>;

  return (
    <div className="space-y-3">
      <Link to={`/changes/${issueId}/analysis`} className="inline-flex items-center gap-1 text-[12px] text-[#6B7280] hover:text-[#1F2937]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Analysis
      </Link>

      <div className="flex flex-wrap items-center gap-4 border-b border-[#E5E7EB]">
        {[["discipline", "By Discipline"], ["fact", "By Fact"]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn("-mb-px border-b-2 pb-2 text-[13px]", tab === key ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-[#6B7280]")}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 pb-2 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#16A34A]" /> Stated</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> Inferred</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#EF4444]" /> Missing</span>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[150px_1fr]">
        {tab === "discipline" ? (
          <div className="space-y-2">
            {DISCIPLINE_NAMES.map((d) => {
              const count = facts.filter((f) => f.discipline === d).length;
              return (
                <button
                  key={d}
                  onClick={() => setSelected(selected === d ? null : d)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[10px] border bg-white p-2.5 text-left",
                    selected === d ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E5E7EB] hover:bg-[#F8FAFC]"
                  )}
                >
                  <DisciplineIcon name={d} size="sm" />
                  <span className="text-[12px]">{d}</span>
                  <span className="ml-auto text-[12px] text-[#6B7280]">{count}</span>
                </button>
              );
            })}
          </div>
        ) : <div />}

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold">Evidence and Traceability</h2>
            <AddEvidenceDialog issue={issue} onAdded={load} />
          </div>

          {facts.length === 0 ? (
            <p className="mt-3 rounded-[10px] border border-dashed border-[#E5E7EB] bg-white p-8 text-center text-[12px] text-[#6B7280]">
              No evidence has been added to this issue.
            </p>
          ) : tab === "discipline" ? (
            <div className="mt-2 space-y-0">
              {shown.map((f, i) => (
                <div key={f.id}>
                  <EvidenceCard fact={f} onDelete={remove} onConfirm={confirm} />
                  {i < shown.length - 1 ? (
                    <p className="py-1.5 pl-4 text-[11px] text-[#6B7280]">{i === 0 ? "Derived from" : "Which relies on"}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              {groups.map((g) => (
                <div key={g}>
                  <p className="text-[12px] font-medium text-[#6B7280]">{g}</p>
                  <div className="mt-1 space-y-2">
                    {facts.filter((f) => (f.fact_group || "Other") === g).map((f) => (
                      <EvidenceCard key={f.id} fact={f} onDelete={remove} onConfirm={confirm} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to={`/changes/${issueId}/resolve`} className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2563EB] px-4 text-[12px] font-medium text-white hover:bg-[#1D4ED8]">
            Continue to Resolve Room <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}