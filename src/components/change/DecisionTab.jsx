import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Pill from "@/components/common/Pill";
import JiraLink, { RELATIONSHIPS } from "@/components/common/JiraLink";
import DecisionRecord from "@/components/timeline/DecisionRecord";

export default function DecisionTab({ change, conflicts, impacts, entry, onSaved }) {
  const openConflict = conflicts.find((c) => !c.resolved) || conflicts[0];
  const [options, setOptions] = useState([
    { label: "", description: "", rejected_reason: "" },
    { label: "", description: "", rejected_reason: "" },
  ]);
  const [chosen, setChosen] = useState(0);
  const [resolver, setResolver] = useState("");
  const [role, setRole] = useState("");
  const [reason, setReason] = useState("");
  const [jira, setJira] = useState([]);
  const [busy, setBusy] = useState(false);

  if (change.status === "resolved") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-risk-low/30 bg-risk-low-soft p-6">
          <Pill tone="resolved">resolved</Pill>
          <p className="mt-3 font-heading text-lg font-semibold">{change.final_decision}</p>
          <p className="mt-2 text-sm">{change.decision_reason}</p>
          <p className="mt-3 font-mono text-[11px] text-muted-foreground">
            decided by {change.decided_by} on {change.decision_date}
          </p>
        </div>
        {entry ? <DecisionRecord entry={entry} /> : null}
      </div>
    );
  }

  const setOpt = (i, key, value) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? { ...o, [key]: value } : o)));

  const save = async () => {
    const chosenOpt = options[chosen];
    if (!chosenOpt?.label || !resolver) return;
    setBusy(true);
    const today = new Date().toISOString().slice(0, 10);
    await base44.entities.Change.update(change.id, {
      status: "resolved",
      final_decision: chosenOpt.label,
      decided_by: resolver,
      decision_reason: reason,
      decision_date: today,
    });
    if (openConflict && !openConflict.resolved) {
      await base44.entities.Conflict.update(openConflict.id, { resolved: true });
    }
    await base44.entities.DecisionEntry.create({
      change_id: change.id,
      change_title: change.title,
      title: chosenOpt.label,
      resolver,
      resolver_role: role,
      disciplines: impacts.map((i) => i.discipline),
      decision_date: today,
      conflict_id: openConflict?.id || "",
      conflict_text: openConflict?.description || "",
      options: options
        .filter((o) => o.label)
        .map((o, idx) => ({ ...o, rejected_reason: idx === chosen ? "" : o.rejected_reason })),
      chosen_option: chosenOpt.label,
      chosen_reason: reason,
      jira_links: jira.filter((j) => j.key),
    });
    setBusy(false);
    onSaved?.();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-risk-high/30 bg-risk-high-soft p-6">
        <Pill tone="unresolved">still open</Pill>
        <p className="mt-3 text-sm">
          <span className="font-medium">{change.decision_owner || "Project manager"}</span> needs to make the call
          {change.decision_due ? ` by ${change.decision_due}` : ""}.
        </p>
        {openConflict ? <p className="mt-2 text-sm">{openConflict.open_question}</p> : null}
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">Record the decision</h3>

        {options.map((o, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <input type="radio" name="chosen" checked={chosen === i} onChange={() => setChosen(i)} className="accent-black" />
              <Input placeholder="Option name" value={o.label} onChange={(e) => setOpt(i, "label", e.target.value)} />
              {options.length > 1 ? (
                <button onClick={() => setOptions(options.filter((_, idx) => idx !== i))} className="text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <Input
              className="mt-3"
              placeholder="Short description"
              value={o.description}
              onChange={(e) => setOpt(i, "description", e.target.value)}
            />
            {chosen !== i ? (
              <Input
                className="mt-3"
                placeholder="Why this one was not picked"
                value={o.rejected_reason}
                onChange={(e) => setOpt(i, "rejected_reason", e.target.value)}
              />
            ) : null}
          </div>
        ))}
        <Button
          variant="outline"
          className="rounded-full"
          onClick={() => setOptions([...options, { label: "", description: "", rejected_reason: "" }])}
        >
          <Plus className="mr-2 h-4 w-4" /> Add another option
        </Button>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Who decided" value={resolver} onChange={(e) => setResolver(e.target.value)} />
          <Input placeholder="Their role" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <Textarea placeholder="Why this option was chosen" value={reason} onChange={(e) => setReason(e.target.value)} />

        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Affected Jira items</p>
          {jira.map((j, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-4">
              <Input placeholder="PROJ-184" value={j.key} onChange={(e) => setJira(jira.map((x, idx) => (idx === i ? { ...x, key: e.target.value } : x)))} />
              <Input placeholder="Link" value={j.url} onChange={(e) => setJira(jira.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))} />
              <Input placeholder="Summary" value={j.summary} onChange={(e) => setJira(jira.map((x, idx) => (idx === i ? { ...x, summary: e.target.value } : x)))} />
              <select
                className="rounded-md border border-border bg-card px-3 py-2 text-sm"
                value={j.relationship}
                onChange={(e) => setJira(jira.map((x, idx) => (idx === i ? { ...x, relationship: e.target.value } : x)))}
              >
                {RELATIONSHIPS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
          ))}
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setJira([...jira, { key: "", url: "", summary: "", relationship: "Affected by this" }])}
          >
            <Plus className="mr-2 h-4 w-4" /> Add a Jira item
          </Button>
          {jira.filter((j) => j.key).map((j, i) => (
            <JiraLink key={i} item={j} />
          ))}
        </div>

        <Button onClick={save} disabled={busy} className="rounded-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save decision
        </Button>
      </div>
    </div>
  );
}