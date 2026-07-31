const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Turns the raw read of a plan into clean numbers we can safely draw in 3D. */
export function normalizePlan(raw) {
  const rooms = (raw?.rooms || [])
    .map((r, i) => ({
      name: r?.name || `Room ${i + 1}`,
      x: num(r?.x),
      y: num(r?.y),
      width: Math.min(Math.max(num(r?.width, 3), 0.5), 60),
      depth: Math.min(Math.max(num(r?.depth, 3), 0.5), 60),
      confidence: r?.confidence || null,
    }))
    .filter((r) => Number.isFinite(r.x) && Number.isFinite(r.y));

  const doors = (raw?.doors || [])
    .filter((d) => ["north", "south", "east", "west"].includes(d?.wall))
    .map((d) => ({ room: d?.room || "", wall: d.wall, width: Math.min(Math.max(num(d?.width, 0.9), 0.4), 3) }));

  return {
    ...raw,
    rooms,
    doors,
    wall_height: Math.min(Math.max(num(raw?.wall_height, 2.7), 2), 6),
  };
}