"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CERTIFICATES } from "@/data/certificates";
import CertificatePlinth from "./CertificatePlinth";
import LandmarkSign from "../world/LandmarkSign";
import { getTerrainHeight, GROVE_CENTER } from "../world/terrainMath";

export default function CertificateGrove() {
  const groundY = useMemo(
    () => getTerrainHeight(GROVE_CENTER.x, GROVE_CENTER.z),
    []
  );

  const firefliesRef = useRef<THREE.Points>(null);

  // Layout 4 certificates along a gentle curving arc
  const plinthPlacements = useMemo(() => {
    const offsets = [
      { x: -1.8, z: -0.6, rot: 0.25 },
      { x: -0.6, z: 0.8, rot: 0.08 },
      { x: 0.9, z: 0.7, rot: -0.15 },
      { x: 2.0, z: -0.5, rot: -0.32 },
    ];

    return CERTIFICATES.map((cert, idx) => {
      const off = offsets[idx % offsets.length];
      const wx = GROVE_CENTER.x + off.x;
      const wz = GROVE_CENTER.z + off.z;
      const wy = getTerrainHeight(wx, wz);
      return {
        cert,
        pos: [wx, wy + 0.6, wz] as [number, number, number],
        rotY: off.rot,
        timingOffset: idx * 1.2,
      };
    });
  }, []);

  // Ambient floating grove particles / fireflies
  const particleData = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 3.5;
      positions[i * 3] = GROVE_CENTER.x + Math.cos(angle) * radius;
      positions[i * 3 + 1] = groundY + 0.5 + Math.random() * 2.5;
      positions[i * 3 + 2] = GROVE_CENTER.z + Math.sin(angle) * radius;
    }
    return positions;
  }, [groundY]);

  useFrame((state) => {
    if (!firefliesRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = firefliesRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < 30; i++) {
      const idx = i * 3 + 1;
      pos[idx] += Math.sin(time * 1.8 + i) * 0.003;
    }
    firefliesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* 1. Landmark Sign near path entrance to grove */}
      <LandmarkSign
        position={[3.8, -27.2]}
        rotationY={0.65}
        title="Certificate Grove"
        subtitle="Verified Credentials"
        accentColor="#a78bfa"
      />

      {/* 2. Stone Courtyard Base */}
      <mesh
        position={[GROVE_CENTER.x, groundY + 0.02, GROVE_CENTER.z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[3.6, 24]} />
        <meshStandardMaterial
          color="#524a3e"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* 3. Four Certificate Plinths */}
      {plinthPlacements.map((item) => (
        <CertificatePlinth
          key={item.cert.id}
          certificate={item.cert}
          worldPosition={item.pos}
          rotationY={item.rotY}
          timingOffset={item.timingOffset}
        />
      ))}

      {/* 4. Ambient Grove Fireflies */}
      <points ref={firefliesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#c4b5fd"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
