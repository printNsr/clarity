import React from "react";

// Simple reusable floor plan illustration. Children are drawn on top (hotspots, markups).
export default function FloorPlan({ children, className = "", height = 200 }) {
  return (
    <svg viewBox="0 0 400 240" style={{ height }} className={`w-full ${className}`} preserveAspectRatio="xMidYMid meet">
      <rect x="10" y="10" width="380" height="220" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <rect x="40" y="40" width="110" height="70" fill="#F8FAFC" stroke="#CBD5E1" />
      <rect x="170" y="40" width="90" height="70" fill="#F8FAFC" stroke="#CBD5E1" />
      <rect x="280" y="40" width="80" height="70" fill="#F8FAFC" stroke="#CBD5E1" />
      <rect x="40" y="150" width="90" height="60" fill="#F8FAFC" stroke="#CBD5E1" />
      <rect x="150" y="150" width="110" height="60" fill="#F8FAFC" stroke="#CBD5E1" />
      <rect x="280" y="150" width="80" height="60" fill="#F8FAFC" stroke="#CBD5E1" />
      <line x1="10" y1="130" x2="390" y2="130" stroke="#E2E8F0" strokeWidth="10" />
      <line x1="10" y1="125" x2="390" y2="125" stroke="#CBD5E1" strokeWidth="1" />
      <line x1="10" y1="135" x2="390" y2="135" stroke="#CBD5E1" strokeWidth="1" />
      {children}
    </svg>
  );
}