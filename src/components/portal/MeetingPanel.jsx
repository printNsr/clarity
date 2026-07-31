import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Mic, StickyNote } from "lucide-react";
import Pill from "@/components/common/Pill";

const catTone = { decision: "low", risk: "high", "open question": "med", "action item": "draft" };

export default function MeetingPanel({ changes, activeChangeId, onCreated }) {
  const [transcript, setTranscript] = useState("");
  const [insights, setInsights] = useState([]);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(false);

  const analyse = async (text) => {
    if (!text.trim()) return;
    setBusy(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Read this construction meeting transcript. Pull out the key points in plain simple English. For each point give a timestamp if one is visible, the point itself, and a category. Mention the change title if one is discussed.\n\nKnown changes: ${changes
        .map((c) => c.title)
        .join("; ")}\n\nTranscript:\n${text}`,
      response_json_schema: {
        type: "object",
        properties: {
          insights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                timestamp: { type: "string" },
                text: { type: "string" },
                category: { type: "string", enum: ["decision", "risk", "open question", "action item"] },
                change_title: { type: "string" },
                confidence: { type: "string", enum: ["High", "Medium", "Low"] },
              },
            },
          },
        },
      },
    });
    const found = (res.insights || []).map((i) => ({
      ...i,
      change_id: changes.find((c) => c.title === i.change_title)?.id || activeChangeId || "",
    }));
    setInsights(found);
    await base44.entities.Meeting.create({
      title: `Meeting on ${new Date().toLocaleDateString()}`,
      change_id: activeChangeId || "",
      datetime: new Date().toISOString(),
      status: "completed",
      transcript: text,
      insights: found,
    });
    setBusy(false);
  };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const text = await base44.integrations.Core.TranscribeAudio({ audio_url: file_url });
    setTranscript(text);
    setBusy(false);
    analyse(text);
  };

  const toChange = async (i) => {
    const change = await base44.entities.Change.create({
      title: i.text.slice(0, 90),
      description: `Raised in a meeting. ${i.text}`,
      urgency: i.category === "risk" ? "high" : "med",
      status: "draft",
    });
    onCreated?.();
    window.location.href = `/change/${change.id}`;
  };

  const toDecision = async (i) => {
    const change = changes.find((c) => c.id === i.change_id);
    await base44.entities.DecisionEntry.create({
      change_id: i.change_id || "",
      change_title: change?.title || "From a meeting",
      title: i.text.slice(0, 90),
      resolver: "To be confirmed",
      decision_date: new Date().toISOString().slice(0, 10),
      options: [{ label: i.text.slice(0, 90), description: "Captured in a meeting, needs review.", rejected_reason: "" }],
      chosen_option: i.text.slice(0, 90),
      chosen_reason: "Captured in a meeting. A person still needs to confirm this.",
    });
    onCreated?.();
  };

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={live ? "default" : "outline"} className="rounded-full" onClick={() => setLive(!live)}>
          <Mic className="mr-2 h-4 w-4" /> {live ? "Stop the meeting" : "Start a meeting"}
        </Button>
        <label>
          <input type="file" accept="audio/*,video/*" className="hidden" onChange={upload} />
          <span className="inline-flex cursor-pointer items-center rounded-full border border-border px-4 py-2 text-sm hover:bg-muted">
            <Upload className="mr-2 h-4 w-4" /> Upload a recording
          </span>
        </label>
        <Button variant="outline" className="rounded-full" onClick={() => setLive(true)}>
          <StickyNote className="mr-2 h-4 w-4" /> Add a note
        </Button>
      </div>

      {live ? (
        <div className="space-y-3">
          <Textarea
            rows={6}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Type or paste what is being said"
          />
          <Button className="rounded-full" disabled={busy} onClick={() => analyse(transcript)}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Find the key points
          </Button>
        </div>
      ) : null}

      {insights.length ? (
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Meeting points, all drafts for review</p>
          {insights.map((i, idx) => (
            <div key={idx} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={catTone[i.category] || "neutral"}>{i.category}</Pill>
                {i.timestamp ? <span className="font-mono text-[11px] text-muted-foreground">{i.timestamp}</span> : null}
                <Pill tone="neutral">confidence {i.confidence || "Medium"}</Pill>
              </div>
              <p className="mt-2 text-sm">{i.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => toDecision(i)}>
                  Add to the decision timeline
                </Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => toChange(i)}>
                  Make it a new change
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}