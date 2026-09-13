"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { getTerrainHeight } from "./terrainMath";

interface LandmarkSignProps {
  position: [number, number]; // [x, z]
  rotationY?: number;
  title: string;
  subtitle?: string;
  accentColor?: string;
}

export default function LandmarkSign({
  position: [x, z],
  rotationY = 0,
  title,
  subtitle,
  accentColor = "#fbbf24",
}: LandmarkSignProps) {
  const groundY = getTerrainHeight(x, z);
  const lanternGlowRef = useRef<THREE.PointLight>(null);

  // Subtle breathing lantern flicker
  useFrame((state) => {
    if (!lanternGlowRef.current) return;
    const t = state.clock.getElapsedTime();
    lanternGlowRef.current.intensity = 0.9 + Math.sin(t * 3.5 + x) * 0.12;
  });

  return (
    <group position={[x, groundY, z]} rotation={[0, rotationY, 0]}>
      {/* 1. Stone Cairn Base around post footer */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.42, 0.24, 7]} />
        <meshStandardMaterial color="#686055" roughness={0.9} flatShading />
      </mesh>

      {/* 2. Weathered Timber Post */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.07, 0.085, 1.9, 8]} />
        <meshStandardMaterial color="#423428" roughness={0.85} />
      </mesh>

      {/* 3. Horizontal Timber Crossbar */}
      <mesh position={[0, 1.62, 0]} castShadow>
        <boxGeometry args={[0.95, 0.08, 0.08]} />
        <meshStandardMaterial color="#4d3c2e" roughness={0.85} />
      </mesh>

      {/* 4. Carved Wooden Signboard */}
      <group position={[0, 1.34, 0]}>
        {/* Signboard Backing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.42, 0.045]} />
          <meshStandardMaterial color="#382a20" roughness={0.8} />
        </mesh>

        {/* Raised Inner Panel */}
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[0.82, 0.36]} />
          <meshStandardMaterial
            color="#2a1f18"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>

        {/* Embedded Elegant Physical Sign Typography */}
        <Html
          position={[0, 0, 0.035]}
          transform
          distanceFactor={6.2}
          center
          className="select-none pointer-events-none"
        >
          <div className="flex w-48 flex-col items-center justify-center text-center p-2">
            <span
              className="text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-300 drop-shadow-sm"
              style={{ color: accentColor }}
            >
              {title}
            </span>
            {subtitle && (
              <span className="mt-0.5 text-[8px] font-medium tracking-wider text-neutral-400">
                {subtitle}
              </span>
            )}
            <div
              className="mt-1 h-[1.5px] w-8 rounded-full"
              style={{ backgroundColor: `${accentColor}80` }}
            />
          </div>
        </Html>
      </group>

      {/* 5. Hanging Brass Lantern atop post */}
      <group position={[0, 1.95, 0.08]}>
        {/* Lantern Iron Cap */}
        <mesh position={[0, 0.08, 0]}>
          <coneGeometry args={[0.11, 0.09, 6]} />
          <meshStandardMaterial color="#1f2326" roughness={0.6} metalness={0.5} />
        </mesh>

        {/* Glowing Amber Glass */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.13, 6]} />
          <meshStandardMaterial
            color="#ffbb55"
            emissive="#ff9922"
            emissiveIntensity={1.4}
            roughness={0.3}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Soft Golden Cast Light */}
        <pointLight
          ref={lanternGlowRef}
          color="#ffaa44"
          intensity={0.95}
          distance={4.5}
          decay={2}
        />
      </group>
    </group>
  );
}
