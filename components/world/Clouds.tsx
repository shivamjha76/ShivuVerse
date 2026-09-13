"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface CloudCluster {
  x: number;
  y: number;
  z: number;
  scale: [number, number, number];
  speed: number;
}

export default function Clouds() {
  const groupRef = useRef<THREE.Group>(null);

  const clouds: CloudCluster[] = useMemo(
    () => [
      { x: -55, y: 36, z: -85, scale: [16, 5.2, 10], speed: 0.18 },
      { x: 20, y: 40, z: -105, scale: [22, 6.0, 13], speed: 0.14 },
      { x: -25, y: 32, z: -55, scale: [14, 4.4, 9], speed: 0.22 },
      { x: 48, y: 37, z: -68, scale: [18, 5.0, 11], speed: 0.16 },
      { x: -65, y: 42, z: -35, scale: [19, 5.5, 11], speed: 0.15 },
      { x: 35, y: 34, z: 0, scale: [15, 4.5, 9], speed: 0.2 },
    ],
    []
  );

  const cloudRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state, delta) => {
    clouds.forEach((cloud, idx) => {
      const obj = cloudRefs.current[idx];
      if (!obj) return;
      obj.position.x += cloud.speed * delta;
      // Wrap around seamlessly
      if (obj.position.x > 95) {
        obj.position.x = -95;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, idx) => (
        <group
          key={idx}
          ref={(el) => {
            cloudRefs.current[idx] = el;
          }}
          position={[cloud.x, cloud.y, cloud.z]}
          scale={cloud.scale}
        >
          {/* Main puffy center */}
          <mesh>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial
              color="#fff8f0"
              emissive="#ffeed9"
              emissiveIntensity={0.22}
              roughness={0.92}
              transparent
              opacity={0.88}
              flatShading={false}
            />
          </mesh>
          {/* Left puff */}
          <mesh position={[-0.85, -0.15, 0]} scale={[0.82, 0.78, 0.82]}>
            <sphereGeometry args={[1, 9, 7]} />
            <meshStandardMaterial
              color="#fff8f0"
              emissive="#ffeed9"
              emissiveIntensity={0.22}
              roughness={0.92}
              transparent
              opacity={0.85}
              flatShading={false}
            />
          </mesh>
          {/* Right puff */}
          <mesh position={[0.85, -0.12, 0.1]} scale={[0.88, 0.82, 0.88]}>
            <sphereGeometry args={[1, 9, 7]} />
            <meshStandardMaterial
              color="#fff8f0"
              emissive="#ffeed9"
              emissiveIntensity={0.22}
              roughness={0.92}
              transparent
              opacity={0.85}
              flatShading={false}
            />
          </mesh>
          {/* Top crowning puff */}
          <mesh position={[0.1, 0.45, -0.1]} scale={[0.68, 0.68, 0.68]}>
            <sphereGeometry args={[1, 9, 7]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#fff2e2"
              emissiveIntensity={0.28}
              roughness={0.92}
              transparent
              opacity={0.9}
              flatShading={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
