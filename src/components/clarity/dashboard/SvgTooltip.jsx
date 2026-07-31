import React from "react";

const CHAR_W = 4.9; // rough width of one character at 8.5px
const MAX_CHARS = 40;

/** Splits text into lines that fit the box width. */
function wrap(text, max = MAX_CHARS) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  words.forEach((w) => {
    if (!cur.length) cur = w;
    else if (cur.length + 1 + w.length <= max) cur += ` ${w}`;
    else { lines.push(cur); cur = w; }
  });
  if (cur) lines.push(cur);
  return lines;
}

/**
 * A callout box that grows or shrinks with the text it holds, and stays inside the canvas.
 * rows: [{ text, weight, color }]
 */
export default function SvgTooltip({ anchor, rows, color, width: W, height: H }) {
  const wrapped = rows
    .filter((r) => r && r.text)
    .flatMap((r) => wrap(r.text).map((text, i) => ({ ...r, text, first: i === 0 })));

  const longest = wrapped.reduce((m, r) => Math.max(m, r.text.length * (r.weight ? 5.4 : CHAR_W)), 0);
  const boxW = Math.min(230, Math.max(110, longest + 16));
  const boxH = 12 + wrapped.length * 12;

  const x = Math.min(Math.max(anchor.sx + 34, 6), W - boxW - 6);
  const y = Math.min(Math.max(anchor.sy - boxH / 2, 6), H - boxH - 6);

  return (
    <g className="pointer-events-none">
      <line x1={anchor.sx} y1={anchor.sy} x2={x} y2={y + boxH / 2} stroke={color} strokeDasharray="3 3" />
      <rect x={x} y={y} width={boxW} height={boxH} rx="5" fill="#FFFFFF" stroke="#E5E7EB" />
      {wrapped.map((r, i) => (
        <text
          key={i}
          x={x + 8}
          y={y + 14 + i * 12}
          fontSize={r.weight ? "9.5" : "8.8"}
          fontWeight={r.weight || 400}
          fill={r.color || "#6B7280"}
        >
          {r.text}
        </text>
      ))}
    </g>
  );
}