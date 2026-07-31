import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, FileText } from "lucide-react";
import DisciplineIcon from "../DisciplineIcon";
import { disc } from "../disciplines";
import { fmtTime } from "../clarityApi";

const BARS = [6, 12, 18, 10, 22, 14, 8, 16, 20, 11, 7, 15, 19, 9, 13, 17, 6, 12, 10, 14];

export default function AudioMessage({ message }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!playing) return undefined;
    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) { setPlaying(false); return 0; }
        return p + 0.04;
      });
    }, 120);
    return () => clearInterval(timer.current);
  }, [playing]);

  const d = disc(message.discipline);

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-3">
      <div className="flex items-center gap-2">
        <DisciplineIcon name={message.discipline} size="sm" />
        <span className="text-[12px] font-medium">{message.discipline}</span>
        <span className="ml-auto text-[11px] text-[#6B7280]">{fmtTime(message.sent_at || message.created_date)}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F8FAFC]"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <div className="flex h-6 flex-1 items-center gap-[2px]">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="w-[3px] rounded-full transition-colors"
              style={{ height: h, background: i / BARS.length <= progress ? d.hex : "#E5E7EB" }}
            />
          ))}
        </div>
        <span className="text-[11px] text-[#6B7280]">{message.duration || "0:00"}</span>
      </div>
      <button onClick={() => setShowTranscript((s) => !s)} className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#2563EB] hover:underline">
        <FileText className="h-3 w-3" /> {showTranscript ? "Hide transcript" : "Transcript"}
      </button>
      {showTranscript ? <p className="mt-1.5 text-[12px] leading-relaxed text-[#6B7280]">{message.transcript}</p> : null}
    </div>
  );
}