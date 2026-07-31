// Simple house footprint used by the 3D hotspot view. Units are metres on a 40 x 24 plot.
export const PLOT_X = 40;
export const PLOT_Z = 24;
export const WALL_H = 6;

export const ROOMS = [
  { name: "Living", x: 0, z: 0, w: 16, d: 14 },
  { name: "Kitchen", x: 16, z: 0, w: 12, d: 14 },
  { name: "Study", x: 28, z: 0, w: 12, d: 14 },
  { name: "Bed 1", x: 0, z: 14, w: 13, d: 10 },
  { name: "Bed 2", x: 13, z: 14, w: 13, d: 10 },
  { name: "Bath", x: 26, z: 14, w: 8, d: 10 },
  { name: "Hall", x: 34, z: 14, w: 6, d: 10 },
];

/** Picks a room for a hotspot so markers always land inside the house. */
export function roomForIndex(idx) {
  return ROOMS[idx % ROOMS.length];
}