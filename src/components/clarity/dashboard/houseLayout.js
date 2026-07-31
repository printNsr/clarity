// Simple house footprints used by the 3D hotspot view. Units are metres on a 40 x 24 plot.
export const PLOT_X = 40;
export const PLOT_Z = 24;
export const WALL_H = 6;

// Each floor is laid out differently so levels are easy to tell apart.
const LAYOUTS = [
  [
    { name: "Lobby", x: 0, z: 0, w: 14, d: 24 },
    { name: "Reception", x: 14, z: 0, w: 12, d: 10 },
    { name: "Waiting", x: 14, z: 10, w: 12, d: 14 },
    { name: "Imaging", x: 26, z: 0, w: 14, d: 13 },
    { name: "Plant", x: 26, z: 13, w: 14, d: 11 },
  ],
  [
    { name: "Ward A", x: 0, z: 0, w: 13, d: 12 },
    { name: "Ward B", x: 0, z: 12, w: 13, d: 12 },
    { name: "Corridor", x: 13, z: 0, w: 6, d: 24 },
    { name: "Theatre", x: 19, z: 0, w: 21, d: 14 },
    { name: "Store", x: 19, z: 14, w: 10, d: 10 },
    { name: "Staff", x: 29, z: 14, w: 11, d: 10 },
  ],
  [
    { name: "Consult 1", x: 0, z: 0, w: 10, d: 11 },
    { name: "Consult 2", x: 10, z: 0, w: 10, d: 11 },
    { name: "Consult 3", x: 20, z: 0, w: 10, d: 11 },
    { name: "Offices", x: 30, z: 0, w: 10, d: 24 },
    { name: "Lab", x: 0, z: 11, w: 16, d: 13 },
    { name: "Break room", x: 16, z: 11, w: 14, d: 13 },
  ],
];

export function roomsForFloor(index) {
  return LAYOUTS[index % LAYOUTS.length];
}

/** Spreads hotspots across different rooms, and starts at a different room per floor. */
export function roomForIndex(rooms, idx, floorIndex) {
  return rooms[(idx * 2 + floorIndex) % rooms.length];
}