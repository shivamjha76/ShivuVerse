"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function AmbientAtmosphere() {
  const pollenRef = useRef<THREE.Points>(null);
  const birdsGroupRef = useRef<THREE.Group>(null);

  // Floating ambient golden pollen / light motes
  const { pollenData, pollenGeometry } = useMemo(() => {
    const count = 70;
    const positions = new Float32Array(count * 3);
    const data: Array<{
      baseX: number;
      baseY: number;
      baseZ: number;
      speed: number;
      offset: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 60;
      const y = 1.0 + Math.random() * 8.0;
      const z = (Math.random() - 0.5) * 80 - 10;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      data.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        speed: 0.15 + Math.random() * 0.25,
        offset: Math.random() * Math.PI * 2,
      });
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { pollenData: data, pollenGeometry: geom };
  }, []);

  // Distant Birds (V-formation silhouettes gliding gracefully across the northern horizon)
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Pollen gentle drifting
    if (pollenRef.current) {
      const pos = pollenRef.current.geometry.attributes.position;
      for (let i = 0; i < pollenData.length; i++) {
        const item = pollenData[i];
        const currentY = item.baseY + Math.sin(time * item.speed + item.offset) * 0.45;
        const currentX = item.baseX + Math.cos(time * 0.2 + item.offset) * 0.6;
        pos.setY(i, currentY);
        pos.setX(i, currentX);
      }
      pos.needsUpdate = true;
    }

    // Birds slow majestic glide across horizon
    if (birdsGroupRef.current) {
      birdsGroupRef.current.position.x += delta * 3.2;
      // Gentle wing-flapping tilt
      birdsGroupRef.current.rotation.z = Math.sin(time * 2.2) * 0.05;
      if (birdsGroupRef.current.position.x > 75) {
        birdsGroupRef.current.position.x = -75;
      }
    }
  });

  return (
    <group>
      {/* 1. Golden Pollen Motes */}
      <points ref={pollenRef} geometry={pollenGeometry}>
        <pointsMaterial
          size={0.07}
          color="#fef08a"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 2. Distant Birds Silhouette Gliding High Overhead */}
      <group
        ref={birdsGroupRef}
        position={[-60, 26, -55]}
        rotation={[0, 0.25, 0]}
      >
        {[
          { x: 0, y: 0, z: 0 },
          { x: -2.2, y: 0.4, z: 1.8 },
          { x: 2.4, y: 0.3, z: 2.0 },
          { x: -4.5, y: 0.8, z: 3.6 },
          { x: 4.6, y: 0.7, z: 3.8 },
        ].map((bird, i) => (
          <group key={i} position={[bird.x, bird.y, bird.z]} scale={0.4}>
            {/* Left wing */}
            <mesh rotation={[0, 0, -0.35]}>
              <planeGeometry args={[0.9, 0.16]} />
              <meshBasicMaterial color="#332c25" side={THREE.DoubleSide} />
            </mesh>
            {/* Right wing */}
            <mesh position={[0.7, 0, 0]} rotation={[0, 0, 0.35]}>
              <planeGeometry args={[0.9, 0.16]} />
              <meshBasicMaterial color="#332c25" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
