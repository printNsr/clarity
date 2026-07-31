import React from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Edges } from "@react-three/drei";

function Scene({ elementA, elementB, overlapDistance }) {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} />

      {/* Duct */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[4.2, 0.9, 0.9]} />
        <meshStandardMaterial color="#93C5FD" />
        <Edges color="#2563EB" />
        <Html position={[-2.1, 0.8, 0]} center distanceFactor={9}>
          <span className="whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-[#1F2937] shadow-sm">
            {elementA}
          </span>
        </Html>
      </mesh>

      {/* Cable tray */}
      <mesh position={[0.4, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[3.6, 0.22, 1.1]} />
        <meshStandardMaterial color="#FDE68A" />
        <Edges color="#B45309" />
        <Html position={[1.8, 0.5, 0]} center distanceFactor={9}>
          <span className="whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-[#1F2937] shadow-sm">
            {elementB}
          </span>
        </Html>
      </mesh>

      {/* Overlap region */}
      <mesh position={[0.4, 0.14, 0]}>
        <boxGeometry args={[1.2, 0.55, 1.2]} />
        <meshStandardMaterial color="#EF4444" transparent opacity={0.45} depthWrite={false} />
        <Edges color="#DC2626" />
        <Html position={[0, 1.1, 0]} center distanceFactor={8}>
          <span className="whitespace-nowrap rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            {overlapDistance} overlap
          </span>
        </Html>
      </mesh>
    </>
  );
}

export default function CollisionViewer3D({
  elementA = "AHU duct",
  elementB = "Cable tray",
  overlapDistance = "300mm",
  overlapLabel = "Hidden collision between cable tray and AHU duct",
  className = "",
}) {
  return (
    <div className={`overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white ${className}`}>
      <div className="h-48 w-full bg-[#F8FAFC]">
        <Canvas
          orthographic
          camera={{ position: [6, 5, 6], zoom: 55, near: -50, far: 100 }}
          onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        >
          <Scene elementA={elementA} elementB={elementB} overlapDistance={overlapDistance} />
        </Canvas>
      </div>
      <div className="flex items-center gap-2 border-t border-[#E5E7EB] px-3 py-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#EF4444]" />
        <p className="text-[12px] text-[#1F2937]">{overlapLabel}</p>
      </div>
    </div>
  );
}