"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { PROJECTS } from "@/data/projects";
import ProjectDisplay from "./ProjectDisplay";
import LandmarkSign from "../world/LandmarkSign";
import { getTerrainHeight } from "../world/terrainMath";

export default function ProjectWorkshop() {
  // Workshop clearing center coordinate (west meadow clearing beside the path)
  const workshopCenter = useMemo(() => ({ x: -7.8, z: -10.5 }), []);
  const centerGroundY = useMemo(
    () => getTerrainHeight(workshopCenter.x, workshopCenter.z),
    [workshopCenter]
  );

  // Compute exact terrain-anchored positions for the 4 project displays
  const displaysWithPositions = useMemo(() => {
    return PROJECTS.map((project, index) => {
      const worldX = workshopCenter.x + project.offset[0];
      const worldZ = workshopCenter.z + project.offset[1];
      const groundY = getTerrainHeight(worldX, worldZ);
      // Display floats ~0.95m above the ground (resting atop its workbench plinth)
      const floatY = groundY + 0.96;

      return {
        project,
        worldPosition: [worldX, floatY, worldZ] as [number, number, number],
        rotationY: project.rotationY,
        timingOffset: index * 0.8,
      };
    });
  }, [workshopCenter]);

  return (
    <group>
      {/* 0. Landmark Sign near path verge */}
      <LandmarkSign
        position={[-4.5, -9.0]}
        rotationY={-0.45}
        title="Project Workshop"
        subtitle="Featured Systems & Apps"
        accentColor="#fbbf24"
      />

      {/* Solid Foundation Base Skirt (prevents ground clipping on slopes) */}
      <mesh
        position={[workshopCenter.x, centerGroundY - 0.15, workshopCenter.z]}
        receiveShadow
      >
        <boxGeometry args={[6.5, 0.48, 5.9]} />
        <meshStandardMaterial
          color="#383025"
          roughness={0.96}
          metalness={0.02}
        />
      </mesh>

      {/* 1. Rustic Timber / Flagstone Workshop Deck Platform */}
      <mesh
        position={[workshopCenter.x, centerGroundY + 0.12, workshopCenter.z]}
        receiveShadow
      >
        <boxGeometry args={[6.4, 0.12, 5.8]} />
        <meshStandardMaterial
          color="#524536"
          roughness={0.9}
          metalness={0.03}
        />
      </mesh>

      {/* Decorative Stone Border Frame around Workshop Platform */}
      <mesh
        position={[workshopCenter.x, centerGroundY + 0.13, workshopCenter.z]}
        receiveShadow
      >
        <boxGeometry args={[6.6, 0.08, 6.0]} />
        <meshStandardMaterial
          color="#42392e"
          roughness={0.94}
          metalness={0.02}
        />
      </mesh>

      {/* 2. Soft Warm Workshop Studio Lighting */}
      <pointLight
        position={[workshopCenter.x, centerGroundY + 2.2, workshopCenter.z]}
        color="#ffdfb0"
        intensity={1.4}
        distance={9.5}
        decay={2}
      />

      {/* Decorative Center Workbench / Drafting Table */}
      <mesh
        position={[workshopCenter.x, centerGroundY + 0.42, workshopCenter.z]}
        scale={[1.1, 0.45, 0.9]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#463c30"
          roughness={0.88}
          metalness={0.04}
        />
      </mesh>

      {/* Decorative Corner Planters with Natural Foliage */}
      {([
        [-2.9, 2.6],
        [2.9, 2.6],
        [-2.9, -2.6],
        [2.9, -2.6],
      ] as const).map(([ox, oz], idx) => {
        const px = workshopCenter.x + ox;
        const pz = workshopCenter.z + oz;
        const py = getTerrainHeight(px, pz);
        return (
          <group key={idx} position={[px, py, pz]}>
            {/* Planter Pot */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.26, 0.22, 0.4, 8]} />
              <meshStandardMaterial color="#5a5246" roughness={0.92} />
            </mesh>
            {/* Shrub foliage */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
              <dodecahedronGeometry args={[0.32, 1]} />
              <meshStandardMaterial color="#4f7541" roughness={0.85} flatShading />
            </mesh>
          </group>
        );
      })}

      {/* 3. The 4 Interactive Project Displays */}
      {displaysWithPositions.map(({ project, worldPosition, rotationY, timingOffset }) => (
        <ProjectDisplay
          key={project.id}
          project={project}
          worldPosition={worldPosition}
          rotationY={rotationY}
          timingOffset={timingOffset}
        />
      ))}
    </group>
  );
}
