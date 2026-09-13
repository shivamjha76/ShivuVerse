"use client";

import React, { useRef } from "react";
import { Sky } from "@react-three/drei";
import * as THREE from "three";

interface EnvironmentProps {
  fogColor?: string;
  sunPosition?: [number, number, number];
}

export default function Environment({
  fogColor = "#e4d9ca",
  sunPosition = [48, 16, -55],
}: EnvironmentProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Distance Atmospheric Fog: Foreground is clear; distant mountains gradually melt into atmospheric golden haze */}
      <fog attach="fog" args={[fogColor, 45, 190]} />

      {/* Cinematic Golden-Hour Sky: Rich azure blue above, soft peach-amber horizon glow */}
      <Sky
        sunPosition={sunPosition}
        turbidity={5.8}
        rayleigh={1.4}
        mieCoefficient={0.0028}
        mieDirectionalG={0.84}
        distance={450000}
      />

      {/* Ambient Cool Fill: Ensures shadowed green foliage and rocks stay readable without muddy orange or crushed black */}
      <ambientLight intensity={0.58} color="#ebf4f8" />

      {/* Hemisphere Light: Warm golden sunlight bounce above, lush green meadow bounce below */}
      <hemisphereLight args={["#ffe6cf", "#3b5438", 0.76]} />

      {/* Main Directional Golden Sunlight with Long Soft Shadows and Rim Highlights */}
      <directionalLight
        ref={dirLightRef}
        position={sunPosition}
        intensity={2.45}
        color="#fff1dc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={180}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-bias={-0.0002}
        shadow-radius={3.8}
      />

      {/* Subtle Rim/Fill Light from Front-Left to give sculptural volume to trees, rocks, and mountains */}
      <directionalLight
        position={[-42, 18, 22]}
        intensity={0.42}
        color="#d8e8f5"
        castShadow={false}
      />
    </>
  );
}
