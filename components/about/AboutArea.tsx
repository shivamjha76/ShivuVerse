"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { setAboutOpen } from "../world/explorationStore";
import LandmarkSign from "../world/LandmarkSign";
import { getTerrainHeight, ABOUT_CENTER } from "../world/terrainMath";

export default function AboutArea() {
  const groundY = useMemo(
    () => getTerrainHeight(ABOUT_CENTER.x, ABOUT_CENTER.z),
    []
  );

  const fireLightRef = useRef<THREE.PointLight>(null);
  const lanternLightRef = useRef<THREE.PointLight>(null);
  const [signHovered, setSignHovered] = useState(false);

  // Campfire subtle natural flicker animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (fireLightRef.current) {
      fireLightRef.current.intensity =
        1.7 + Math.sin(time * 7.5) * 0.28 + Math.cos(time * 13.0) * 0.16;
    }
    if (lanternLightRef.current) {
      lanternLightRef.current.intensity =
        0.85 + Math.sin(time * 2.8) * 0.08;
    }
  });

  const handleOpenAbout = (e: any) => {
    e?.stopPropagation?.();
    setAboutOpen(true);
  };

  return (
    <group position={[ABOUT_CENTER.x, groundY, ABOUT_CENTER.z]}>
      {/* 1. Landmark Signpost beside pathway approach */}
      <group position={[2.6, 0, 2.0]} rotation={[0, 0.45, 0]}>
        <LandmarkSign
          position={[0, 0]}
          title="About Me"
          subtitle="Bio & Philosophy"
          accentColor="#fbbf24"
        />

        {/* Interactive Click Plaque on the sign */}
        <Html
          position={[0, 0.82, 0.2]}
          distanceFactor={9.0}
          center
          className="select-none pointer-events-auto"
        >
          <button
            type="button"
            onClick={handleOpenAbout}
            onMouseEnter={() => {
              setSignHovered(true);
              if (typeof document !== "undefined") {
                document.body.style.cursor = "pointer";
              }
            }}
            onMouseLeave={() => {
              setSignHovered(false);
              if (typeof document !== "undefined") {
                document.body.style.cursor = "auto";
              }
            }}
            className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-neutral-950/90 px-3 py-1 text-[10px] font-semibold tracking-wider text-amber-300 shadow-lg backdrop-blur-md cursor-pointer transition-all hover:scale-105 hover:bg-neutral-900"
            style={{
              boxShadow: signHovered
                ? "0 0 16px rgba(251, 191, 36, 0.4)"
                : "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            <span>Read Bio</span>
            <span>&rarr;</span>
          </button>
        </Html>
      </group>

      {/* 2. Rustic Open Wooden Shelter / Lean-to */}
      <group position={[0, 0, 0]} rotation={[0, 0.28, 0]}>
        {/* Timber Deck Platform */}
        <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.2, 0.12, 3.2]} />
          <meshStandardMaterial
            color="#3a2d21"
            roughness={0.88}
            metalness={0.03}
          />
        </mesh>

        {/* 4 Corner Log Pillars */}
        {[
          [-1.9, 1.35, -1.4],
          [1.9, 1.35, -1.4],
          [-1.9, 1.1, 1.4],
          [1.9, 1.1, 1.4],
        ].map(([px, py, pz], idx) => (
          <mesh key={idx} position={[px, py, pz]} castShadow receiveShadow>
            <cylinderGeometry args={[0.09, 0.11, py * 2, 8]} />
            <meshStandardMaterial color="#423426" roughness={0.85} />
          </mesh>
        ))}

        {/* Slanted Timber Roof Canopy */}
        <mesh
          position={[0, 2.52, 0.05]}
          rotation={[0.16, 0, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[4.5, 0.09, 3.5]} />
          <meshStandardMaterial color="#4f3c2c" roughness={0.82} />
        </mesh>

        {/* Back Wall Horizontal Slats */}
        <mesh position={[0, 1.25, -1.45]} receiveShadow castShadow>
          <boxGeometry args={[3.8, 1.8, 0.06]} />
          <meshStandardMaterial color="#36291e" roughness={0.9} />
        </mesh>

        {/* Storytelling Desk / Workstation */}
        <group position={[0.6, 0.12, -0.6]}>
          {/* Tabletop */}
          <mesh position={[0, 0.68, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.06, 0.85]} />
            <meshStandardMaterial color="#4d3b2c" roughness={0.8} />
          </mesh>
          {/* 4 Table Legs */}
          {[
            [-0.65, 0.34, -0.32],
            [0.65, 0.34, -0.32],
            [-0.65, 0.34, 0.32],
            [0.65, 0.34, 0.32],
          ].map(([lx, ly, lz], i) => (
            <mesh key={i} position={[lx, ly, lz]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.68, 6]} />
              <meshStandardMaterial color="#36291e" roughness={0.85} />
            </mesh>
          ))}

          {/* Wooden Stool Bench */}
          <mesh position={[0, 0.28, 0.65]} castShadow receiveShadow>
            <boxGeometry args={[0.65, 0.05, 0.38]} />
            <meshStandardMaterial color="#423426" roughness={0.85} />
          </mesh>

          {/* Stylized Low-Poly Laptop */}
          <group position={[-0.25, 0.72, 0]} rotation={[0, 0.1, 0]}>
            {/* Base */}
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.015, 0.22]} />
              <meshStandardMaterial color="#1e242b" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Screen Lid (Opened) */}
            <group position={[0, 0.01, -0.1]} rotation={[-0.32, 0, 0]}>
              <mesh position={[0, 0.1, 0]} castShadow>
                <boxGeometry args={[0.32, 0.2, 0.012]} />
                <meshStandardMaterial color="#1e242b" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Glowing Screen Display */}
              <mesh position={[0, 0.1, 0.007]}>
                <planeGeometry args={[0.29, 0.17]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={0.65}
                  roughness={0.2}
                />
              </mesh>
            </group>
          </group>

          {/* Open Notebook / Journal */}
          <group position={[0.32, 0.72, 0.05]} rotation={[0, -0.22, 0]}>
            {/* Leather Cover */}
            <mesh castShadow>
              <boxGeometry args={[0.24, 0.015, 0.32]} />
              <meshStandardMaterial color="#452a1a" roughness={0.7} />
            </mesh>
            {/* Cream Pages */}
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.22, 0.012, 0.3]} />
              <meshStandardMaterial color="#f2ebdc" roughness={0.8} />
            </mesh>
          </group>

          {/* Brass Desk Lantern */}
          <group position={[0.55, 0.72, -0.25]}>
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.045, 0.055, 0.16, 6]} />
              <meshStandardMaterial
                color="#eab308"
                emissive="#ca8a04"
                emissiveIntensity={0.8}
                roughness={0.3}
              />
            </mesh>
            <pointLight
              ref={lanternLightRef}
              position={[0, 0.1, 0]}
              color="#ffcc66"
              intensity={0.85}
              distance={3.2}
              decay={2}
            />
          </group>
        </group>
      </group>

      {/* 3. Cozy Campfire with Flickering Light */}
      <group position={[-0.8, 0, 2.2]}>
        {/* Ash / Charcoal Bed */}
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <circleGeometry args={[0.65, 12]} />
          <meshStandardMaterial color="#1a1816" roughness={0.95} />
        </mesh>

        {/* Ring of 8 River Stones */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const sx = Math.cos(angle) * 0.58;
          const sz = Math.sin(angle) * 0.58;
          return (
            <mesh key={i} position={[sx, 0.08, sz]} castShadow receiveShadow>
              <dodecahedronGeometry args={[0.09, 0]} />
              <meshStandardMaterial color="#686055" roughness={0.9} flatShading />
            </mesh>
          );
        })}

        {/* Crossed Firewood Logs */}
        {[0, 0.8, 1.6, 2.4].map((rot, i) => (
          <mesh
            key={i}
            position={[0, 0.07, 0]}
            rotation={[0.15, rot, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.04, 0.045, 0.52, 5]} />
            <meshStandardMaterial color="#382518" roughness={0.9} />
          </mesh>
        ))}

        {/* Glowing Procedural Flame / Embers */}
        <mesh position={[0, 0.14, 0]}>
          <octahedronGeometry args={[0.12, 0]} />
          <meshStandardMaterial
            color="#ff5500"
            emissive="#ff6600"
            emissiveIntensity={2.5}
            roughness={0.2}
          />
        </mesh>

        {/* Dynamic Flickering Firelight */}
        <pointLight
          ref={fireLightRef}
          position={[0, 0.35, 0]}
          color="#ff8c33"
          intensity={1.8}
          distance={6.5}
          decay={2}
          castShadow
        />
      </group>

      {/* 4. Surrounding Natural Greenery Tufts */}
      {[
        [-2.4, 0, -1.6],
        [-2.2, 0, 1.2],
        [2.3, 0, -1.5],
        [1.8, 0, 1.8],
      ].map(([fx, fy, fz], idx) => (
        <mesh key={idx} position={[fx, fy + 0.18, fz]} receiveShadow>
          <dodecahedronGeometry args={[0.32, 1]} />
          <meshStandardMaterial
            color="#3d5a2d"
            roughness={0.85}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
