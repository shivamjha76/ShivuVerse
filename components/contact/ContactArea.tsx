"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import ContactCard from "./ContactCard";
import LandmarkSign from "../world/LandmarkSign";
import { getTerrainHeight, OVERLOOK_CENTER } from "../world/terrainMath";
import { CONTACT_DATA } from "@/data/contact";

export default function ContactArea() {
  const groundY = useMemo(
    () => getTerrainHeight(OVERLOOK_CENTER.x, OVERLOOK_CENTER.z),
    []
  );

  return (
    <group position={[OVERLOOK_CENTER.x, groundY, OVERLOOK_CENTER.z]}>
      {/* 1. Landmark Sign along pathway approach */}
      <LandmarkSign
        position={[2.4, 2.8]}
        rotationY={0.35}
        title="Sunset Overlook"
        subtitle="Final Viewpoint & Contact"
        accentColor="#fbbf24"
      />

      {/* 2. Scenic Overlook Wooden Bridge / Deck */}
      <group position={[0, 0, 0]}>
        {/* Stone Foundation Piers */}
        {[
          [-1.8, -0.4, -1.8],
          [1.8, -0.4, -1.8],
          [-1.8, -0.4, 1.8],
          [1.8, -0.4, 1.8],
        ].map(([px, py, pz], idx) => (
          <mesh key={idx} position={[px, py, pz]} receiveShadow castShadow>
            <cylinderGeometry args={[0.35, 0.45, 1.0, 7]} />
            <meshStandardMaterial color="#554d42" roughness={0.9} flatShading />
          </mesh>
        ))}

        {/* Heavy Timber Planks Platform */}
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.4, 0.18, 4.6]} />
          <meshStandardMaterial color="#423325" roughness={0.88} />
        </mesh>

        {/* Handrail Posts & Crossbars */}
        {/* Left Railing */}
        <mesh position={[-2.1, 0.65, 0]} castShadow>
          <boxGeometry args={[0.08, 0.9, 4.4]} />
          <meshStandardMaterial color="#35281e" roughness={0.85} />
        </mesh>
        {/* Right Railing */}
        <mesh position={[2.1, 0.65, 0]} castShadow>
          <boxGeometry args={[0.08, 0.9, 4.4]} />
          <meshStandardMaterial color="#35281e" roughness={0.85} />
        </mesh>
        {/* Front Vista Railing */}
        <mesh position={[0, 0.65, -2.2]} castShadow>
          <boxGeometry args={[4.2, 0.9, 0.08]} />
          <meshStandardMaterial color="#35281e" roughness={0.85} />
        </mesh>

        {/* Twin Viewpoint Iron Lanterns */}
        {[-2.0, 2.0].map((lx, i) => (
          <group key={i} position={[lx, 1.15, -2.1]}>
            <mesh position={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.07, 0.22, 6]} />
              <meshStandardMaterial
                color="#ffb347"
                emissive="#ff8800"
                emissiveIntensity={1.2}
                roughness={0.3}
              />
            </mesh>
            <pointLight
              position={[0, 0.1, 0]}
              color="#ffaa44"
              intensity={1.2}
              distance={5.5}
              decay={2}
            />
          </group>
        ))}

        {/* Carved Signoff Plaque on front railing */}
        <group position={[0, 0.68, -2.12]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.2, 0.38, 0.05]} />
            <meshStandardMaterial color="#2d2219" roughness={0.8} />
          </mesh>
          <Html
            position={[0, 0, 0.035]}
            transform
            distanceFactor={7.5}
            center
            className="select-none pointer-events-none"
          >
            <div className="flex w-72 flex-col items-center justify-center text-center p-1">
              <span className="text-xs font-serif italic text-amber-200 drop-shadow-md">
                &ldquo;{CONTACT_DATA.signoff.message}&rdquo;
              </span>
              <span className="mt-0.5 text-[10px] font-medium tracking-wider text-amber-400 font-mono">
                {CONTACT_DATA.signoff.author}
              </span>
            </div>
          </Html>
        </group>

        {/* 3. In-World Interactive Contact Kiosk */}
        <group position={[0, 0.22, 0.3]}>
          <Html
            position={[0, 1.2, 0]}
            distanceFactor={11.0}
            center
            className="pointer-events-auto"
          >
            <ContactCard />
          </Html>
        </group>
      </group>
    </group>
  );
}
