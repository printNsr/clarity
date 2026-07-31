import React, { useEffect, useMemo, useRef, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import DisciplineChip from "@/components/common/DisciplineChip";
import NodePanel from "@/components/graph/NodePanel";
import { buildGraph, REL_STROKE } from "@/components/graph/graphModel";

const DISCIPLINES = ["Mechanical", "Electrical", "Fire", "QS", "Architecture", "Structural", "PM"];
const RELS = Object.keys(REL_STROKE);
const NODE_FILL = { Change: "hsl(var(--card))", Decision: "hsl(var(--accent))", Jira: "hsl(var(--card))" };

export default function ImpactGraph() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [discipline, setDiscipline] = useState("");
  const [rel, setRel] = useState("");
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

  useEffect(() => {
    Promise.all([base44.entities.Change.list("-created_date"), base44.entities.DecisionEntry.list("-decision_date")]).then(
      ([c, e]) => setGraph(buildGraph(c, e))
    );
  }, []);

  const view = useMemo(() => {
    const edges = graph.edges.filter(
      (e) => (!rel || e.label === rel) && (!discipline || (e.disciplines || []).includes(discipline))
    );
    const keep = new Set(edges.flatMap((e) => [e.from, e.to]));
    const nodes = graph.nodes.filter((n) => (!rel && !discipline ? true : keep.has(n.id)));
    return { nodes, edges };
  }, [graph, rel, discipline]);

  const nodeById = (id) => view.nodes.find((n) => n.id === id);

  const onDown = (e) => (drag.current = { x: e.clientX - pan.x, y: e.clientY - pan.y });
  const onMove = (e) => {
    if (!drag.current) return;
    setPan({ x: e.clientX - drag.current.x, y: e.clientY - drag.current.y });
  };
  const stop = () => (drag.current = null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Impact Graph</h1>
        <p className="mt-1 text-sm text-muted-foreground">How changes, decisions and Jira items connect.</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap gap-2">
          <DisciplineChip name="All teams" active={!discipline} onClick={() => setDiscipline("")} />
          {DISCIPLINES.map((d) => (
            <DisciplineChip key={d} name={d} active={discipline === d} onClick={() => setDiscipline(d)} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <DisciplineChip name="All links" active={!rel} onClick={() => setRel("")} />
          {RELS.map((r) => (
            <DisciplineChip key={r} name={r} active={rel === r} onClick={() => setRel(r)} />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <Button size="icon" variant="outline" className="rounded-full" onClick={() => setZoom((z) => Math.min(2, z + 0.2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full" onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        <svg
          className="h-[560px] w-full cursor-grab active:cursor-grabbing"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={stop}
          onMouseLeave={stop}
        >
          <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
            {view.edges.map((e, i) => {
              const a = nodeById(e.from);
              const b = nodeById(e.to);
              if (!a || !b) return null;
              return (
                <g key={i}>
                  <line x1={a.x + 90} y1={a.y + 24} x2={b.x} y2={b.y + 24} stroke={REL_STROKE[e.label]} strokeWidth="2" />
                  <text
                    x={(a.x + 90 + b.x) / 2}
                    y={(a.y + b.y) / 2 + 16}
                    fill={REL_STROKE[e.label]}
                    className="font-mono"
                    fontSize="11"
                    textAnchor="middle"
                  >
                    {e.label}
                  </text>
                </g>
              );
            })}
            {view.nodes.map((n) => (
              <g key={n.id} onClick={() => setSelected(n)} className="cursor-pointer">
                <rect
                  x={n.x}
                  y={n.y}
                  width="180"
                  height="48"
                  rx="14"
                  fill={NODE_FILL[n.kind]}
                  stroke="hsl(var(--border))"
                />
                <text x={n.x + 14} y={n.y + 20} fontSize="10" className="font-mono" fill="hsl(var(--muted-foreground))">
                  {n.kind}
                </text>
                <text x={n.x + 14} y={n.y + 36} fontSize="12" fill="hsl(var(--foreground))">
                  {n.label.length > 24 ? `${n.label.slice(0, 24)}...` : n.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <NodePanel node={selected} onClose={() => setSelected(null)} />
    </div>
  );
}