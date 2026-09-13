"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { SOCIAL_PROFILES } from "@/data/socials";
import SocialNode from "./SocialNode";
import LandmarkSign from "../world/LandmarkSign";
import { getTerrainHeight } from "../world/terrainMath";

export default function SocialGarden() {
  // Center coordinate of the Social Garden clearing
  const gardenCenter = useMemo(() => ({ x: 7.4, z: -4.2 }), []);
  const centerGroundY = useMemo(
    () => getTerrainHeight(gardenCenter.x, gardenCenter.z),
    [gardenCenter]
  );

  // Compute exact terrain-anchored positions for the 4 social nodes
  const nodesWithPositions = useMemo(() => {
    return SOCIAL_PROFILES.map((profile, index) => {
      const worldX = gardenCenter.x + profile.offset[0];
      const worldZ = gardenCenter.z + profile.offset[1];
      const groundY = getTerrainHeight(worldX, worldZ);
      // Node floats ~0.9m above the ground (resting ~0.45m above its stone pedestal)
      const floatY = groundY + 0.92;

      return {
        profile,
        worldPosition: [worldX, floatY, worldZ] as [number, number, number],
        timingOffset: index * 0.95,
      };
    });
  }, [gardenCenter]);

  // Organic garden stone terrace geometry
  const terraceGeometry = useMemo(() => {
    return new THREE.CircleGeometry(2.8, 24);
  }, []);

  return (
    <group>
      {/* 0. Landmark Sign near path verge */}
      <LandmarkSign
        position={[4.8, -2.8]}
        rotationY={0.55}
        title="Social Garden"
        subtitle="Profiles & Connections"
        accentColor="#38bdf8"
      />

      {/* 1. Garden Stone Terrace Plinth (3D foundation prevents slope clipping) */}
      <mesh
        position={[gardenCenter.x, centerGroundY - 0.05, gardenCenter.z]}
        receiveShadow
        castShadow
      >
        <cylinderGeometry args={[2.85, 2.95, 0.35, 28]} />
        <meshStandardMaterial
          color="#645c50"
          roughness={0.92}
          metalness={0.03}
        />
      </mesh>

      {/* Decorative Upper Terrace Trim */}
      <mesh
        position={[gardenCenter.x, centerGroundY + 0.12, gardenCenter.z]}
        receiveShadow
      >
        <cylinderGeometry args={[2.8, 2.85, 0.06, 28]} />
        <meshStandardMaterial
          color="#756b5e"
          roughness={0.88}
          metalness={0.04}
        />
      </mesh>

      {/* 2. Soft Localized Garden Lantern / Warm Ambient Illumination */}
      <pointLight
        position={[gardenCenter.x, centerGroundY + 1.6, gardenCenter.z]}
        color="#ffe2b8"
        intensity={1.1}
        distance={8.5}
        decay={2}
      />

      {/* Decorative Central Sanctuary Marker Stone */}
      <mesh
        position={[gardenCenter.x, centerGroundY + 0.15, gardenCenter.z]}
        scale={[0.7, 0.28, 0.7]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#524c43"
          roughness={0.9}
          metalness={0.04}
          flatShading
        />
      </mesh>

      {/* 3. The 4 Interactive 3D Social Nodes */}
      {nodesWithPositions.map(({ profile, worldPosition, timingOffset }) => (
        <SocialNode
          key={profile.id}
          profile={profile}
          worldPosition={worldPosition}
          timingOffset={timingOffset}
        />
      ))}
    </group>
  );
}
