import React, { useState } from "react";
import { fmtTime } from "../clarityApi";

// One milestone dot on the activity time axis.
export default function TimelineMarker({ event, left, color, onClick }) {
  const [show, setShow] = useState(false);
  return (
    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%` }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className={`h-3 w-3 rounded-full border-2 border-card ring-2 ring-transparent transition-transform hover:scale-150 ${color}`}
        aria-label={event.title}
      />
      {show ? (
        <div
          className="pointer-events-none absolute bottom-5 z-10 w-44 rounded-md border border-border bg-card px-2 py-1.5 text-left shadow-md"
          style={left > 70 ? { right: 0 } : left < 30 ? { left: 0 } : { left: "50%", transform: "translateX(-50%)" }}
        >
          <p className="text-[11px] font-medium leading-snug">{event.title}</p>
          <p className="text-[10px] text-muted-foreground">{fmtTime(event.occurred_at || event.created_date)}</p>
        </div>
      ) : null}
    </div>
  );
}