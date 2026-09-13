"use client";

import React, { useRef } from "react";
import { Sky } from "@react-three/drei";
import * as THREE from "three";

interface EnvironmentProps {
  fogColor?: string;
  sunPosition?: [number, number, number];
}

export default function Environment({
  fogColor = "#e6d7c7",
  sunPosition = [65, 18, -48],
}: EnvironmentProps) {
  const dirLightRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Distance Atmospheric Fog: Foreground remains crisp; background softens into the horizon */}
      <fog attach="fog" args={[fogColor, 35, 140]} />

      {/* Golden-Hour Sky: Serene soft azure above, warm peach-amber haze near horizon */}
      <Sky
        sunPosition={sunPosition}
        turbidity={6.2}
        rayleigh={1.6}
        mieCoefficient={0.003}
        mieDirectionalG={0.82}
        distance={450000}
      />

      {/* Ambient Fill: Keeps shadowed foliage, rocks, and path readable without crushed blacks */}
      <ambientLight intensity={0.56} color="#eef3f6" />

      {/* Hemisphere Light: Warm golden sky above, soft meadow-green ground bounce below */}
      <hemisphereLight args={["#ffe2c6", "#445946", 0.72]} />

      {/* Main Directional Sunlight with Soft Shadows */}
      <directionalLight
        ref={dirLightRef}
        position={sunPosition}
        intensity={2.3}
        color="#fff4e2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={160}
        shadow-camera-left={-48}
        shadow-camera-right={48}
        shadow-camera-top={48}
        shadow-camera-bottom={-48}
        shadow-bias={-0.00025}
        shadow-radius={3.5}
      />

      {/* Gentle Rim/Fill Light from Front-Left to give dimensional relief to trees and hills */}
      <directionalLight
        position={[-35, 16, 25]}
        intensity={0.36}
        color="#d8e8f5"
        castShadow={false}
      />
    </>
  );
}
