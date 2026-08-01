import React, { useRef, useState } from "react";
import { UploadCloud, Loader2, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { normalizePlan } from "./normalizePlan";
import { logAiUsage } from "@/components/clarity/ai/logAiUsage";

const SCHEMA = {
  type: "object",
  properties: {
    plan_name: { type: "string" },
    scale_note: { type: "string" },
    wall_height: { type: "number" },
    rooms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          x: { type: "number" },
          y: { type: "number" },
          width: { type: "number" },
          depth: { type: "number" },
          confidence: { type: "string", enum: ["High", "Medium", "Low"] },
        },
      },
    },
    doors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          room: { type: "string" },
          x: { type: "number" },
          y: { type: "number" },
          width: { type: "number" },
          wall: { type: "string", enum: ["north", "south", "east", "west"] },
        },
      },
    },
    text_found: { type: "array", items: { type: "string" } },
    notes: { type: "array", items: { type: "string" } },
  },
};

const PROMPT = `You are reading a hand drawn or scanned building floor plan.
Read every piece of text you can see (room names, dimensions, notes) and work out the layout.
Return a digital version of the plan:
- rooms: each room as a rectangle in metres, x and y are the bottom left corner on a flat plan grid, width runs east to west, depth runs north to south. Rooms must sit side by side without overlapping, matching the drawing as closely as you can.
- doors: door openings with the room they belong to, the wall they sit on and their width in metres.
- wall_height: the wall height in metres (use 2.7 if the plan does not say).
- text_found: every label or note you could read on the plan.
- notes: anything unclear or missing that a person should check.
Use plain simple English. Keep the whole plan within about 40 metres in each direction.`;

export default function PlanUpload({ onResult }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handle = async (file) => {
    if (!file) return;
    setError("");
    setBusy(true);
    setFileName(file.name);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: PROMPT,
        file_urls: [file_url],
        response_json_schema: SCHEMA,
      });
      onResult({ ...normalizePlan(result), source_url: file_url, source_name: file.name });
      logAiUsage({ feature: "Plan Analyzer", reference: file.name, output: result });
    } catch (e) {
      setError("We could not read that plan. Try a clearer photo or another file.");
      logAiUsage({ feature: "Plan Analyzer", reference: file.name, status: "Failed" });
    }
    setBusy(false);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files?.[0]); }}
      className="rounded-[14px] border border-dashed border-[#E5E7EB] bg-white p-10 text-center"
    >
      {busy ? (
        <>
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#7C3AED]" />
          <p className="mt-2 text-[13px] font-medium">Reading {fileName}</p>
          <p className="text-[12px] text-[#6B7280]">Finding the text and working out the rooms. This takes a moment.</p>
        </>
      ) : (
        <>
          <UploadCloud className="mx-auto h-6 w-6 text-[#CBD5E1]" />
          <p className="mt-2 text-[13px] font-medium">Drop a plan here, or pick a file</p>
          <p className="text-[12px] text-[#6B7280]">Photos of hand drawn plans, images or PDFs all work.</p>
          <button
            onClick={() => inputRef.current?.click()}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-md bg-[#7C3AED] px-3 text-[12px] font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#6D28D9] hover:shadow-md hover:shadow-[#7C3AED]/30"
          >
            <FileText className="h-3.5 w-3.5" /> Choose file
          </button>
          {error && <p className="mt-3 text-[12px] text-risk-high">{error}</p>}
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
    </div>
  );
}