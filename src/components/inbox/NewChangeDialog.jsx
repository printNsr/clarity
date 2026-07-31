import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";

const DISCIPLINES = ["Mechanical", "Electrical", "Fire", "QS", "Architecture", "Structural", "PM"];

function keywordPass(text) {
  const lower = text.toLowerCase();
  const urgency = /urgent|immediately|today|clash|stop/.test(lower) ? "high" : /soon|this week/.test(lower) ? "med" : "low";
  const hits = DISCIPLINES.filter((d) => lower.includes(d.toLowerCase()));
  return {
    title: text.split("\n")[0].slice(0, 90),
    description: text,
    urgency,
    needs_decision: true,
    impacts: (hits.length ? hits : ["PM"]).map((d) => ({
      discipline: d,
      severity: "med",
      reason: "Mentioned in the pasted text, needs a person to review.",
      confidence: "Low",
    })),
  };
}

export default function NewChangeDialog({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!text.trim()) return;
    setBusy(true);
    let draft;
    try {
      draft = await base44.integrations.Core.InvokeLLM({
        prompt: `Read this construction project note and pull out one change. Use plain simple English. Note:\n\n${text}`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            urgency: { type: "string", enum: ["high", "med", "low"] },
            needs_decision: { type: "boolean" },
            impacts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  discipline: { type: "string", enum: DISCIPLINES },
                  severity: { type: "string", enum: ["high", "med", "low"] },
                  reason: { type: "string" },
                  confidence: { type: "string", enum: ["High", "Medium", "Low"] },
                },
              },
            },
          },
        },
      });
    } catch {
      draft = keywordPass(text);
    }
    if (!draft || !draft.title) draft = keywordPass(text);

    const change = await base44.entities.Change.create({
      title: draft.title,
      description: draft.description || text,
      urgency: draft.urgency || "med",
      needs_decision: draft.needs_decision !== false,
      status: "draft",
    });
    const impacts = (draft.impacts || []).filter((i) => DISCIPLINES.includes(i.discipline));
    if (impacts.length) {
      await base44.entities.DisciplineImpact.bulkCreate(
        impacts.map((i) => ({
          change_id: change.id,
          discipline: i.discipline,
          severity: i.severity || "med",
          reason: i.reason || "",
          confidence: i.confidence || "Low",
          source_ref: "Pasted note",
        }))
      );
    }
    setBusy(false);
    setText("");
    setOpen(false);
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus className="mr-2 h-4 w-4" /> Add a change
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">Paste what changed</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Paste an email, a site note or a drawing comment. Clarity makes a draft for a person to review.
        </p>
        <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the text here" />
        <Button onClick={submit} disabled={busy || !text.trim()} className="rounded-full">
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create draft change
        </Button>
      </DialogContent>
    </Dialog>
  );
}