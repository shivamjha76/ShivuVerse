"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getTerrainHeight } from "./terrainMath";

export type TreeVariant = "oak" | "birch" | "willow" | "pine";

interface SingleTreeProps {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
  variant?: TreeVariant;
  windOffset?: number;
}

export function Tree({
  position,
  scale = 1.0,
  rotationY = 0,
  variant = "oak",
  windOffset = 0,
}: SingleTreeProps) {
  const foliageGroupRef = useRef<THREE.Group>(null);

  // Natural subtle wind breathing
  useFrame((state) => {
    if (!foliageGroupRef.current) return;
    const t = state.clock.getElapsedTime() * 0.75 + windOffset;
    foliageGroupRef.current.rotation.z = Math.sin(t) * 0.022;
    foliageGroupRef.current.rotation.x = Math.cos(t * 0.8) * 0.016;
  });

  const config = useMemo(() => {
    switch (variant) {
      case "birch":
        return {
          trunkColor: "#d9d2c5", // Pale birch bark
          trunkRingColor: "#3a342c",
          canopyColors: ["#426e31", "#538a3c", "#6ba84c", "#7ebd58"],
          trunkRadiusTop: 0.14,
          trunkRadiusBottom: 0.28,
          trunkHeight: 3.8,
        };
      case "willow":
        return {
          trunkColor: "#423528",
          trunkRingColor: "#2c2219",
          canopyColors: ["#3b5a32", "#4b703e", "#5c854b", "#6e9958"],
          trunkRadiusTop: 0.24,
          trunkRadiusBottom: 0.44,
          trunkHeight: 2.8,
        };
      case "pine":
        return {
          trunkColor: "#38291e",
          trunkRingColor: "#261a12",
          canopyColors: ["#23442a", "#2b5233", "#37663e", "#44784d"],
          trunkRadiusTop: 0.15,
          trunkRadiusBottom: 0.35,
          trunkHeight: 4.2,
        };
      case "oak":
      default:
        return {
          trunkColor: "#4a3928",
          trunkRingColor: "#32251a",
          canopyColors: ["#2f5424", "#3d6b2f", "#4e823b", "#629949"],
          trunkRadiusTop: 0.26,
          trunkRadiusBottom: 0.48,
          trunkHeight: 3.2,
        };
    }
  }, [variant]);

  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* 1. Trunk with Root Flare Base */}
      {/* Root flare */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[config.trunkRadiusBottom * 0.85, config.trunkRadiusBottom * 1.35, 0.45, 8]}
        />
        <meshStandardMaterial
          color={config.trunkColor}
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      {/* Main Trunk Column */}
      <mesh
        position={[0, config.trunkHeight * 0.5 + 0.2, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            config.trunkRadiusTop,
            config.trunkRadiusBottom,
            config.trunkHeight,
            8,
          ]}
        />
        <meshStandardMaterial
          color={config.trunkColor}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* Primary Left Branch */}
      {variant !== "pine" && (
        <mesh
          position={[-0.32, config.trunkHeight * 0.75, -0.15]}
          rotation={[-0.3, -0.4, 0.55]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[config.trunkRadiusTop * 0.6, config.trunkRadiusTop * 0.9, 1.4, 6]} />
          <meshStandardMaterial
            color={config.trunkColor}
            roughness={0.88}
            metalness={0.02}
          />
        </mesh>
      )}

      {/* Primary Right Branch */}
      {variant !== "pine" && (
        <mesh
          position={[0.38, config.trunkHeight * 0.8, 0.18]}
          rotation={[0.25, 0.35, -0.6]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[config.trunkRadiusTop * 0.6, config.trunkRadiusTop * 0.9, 1.5, 6]} />
          <meshStandardMaterial
            color={config.trunkColor}
            roughness={0.88}
            metalness={0.02}
          />
        </mesh>
      )}

      {/* 2. Sculpted Multi-Tier Volumetric Foliage Canopies */}
      <group
        ref={foliageGroupRef}
        position={[0, config.trunkHeight + 0.2, 0]}
      >
        {variant === "pine" ? (
          // Conical Evergreen Tiered Layers
          <>
            {/* Bottom Tier */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <coneGeometry args={[1.7, 1.8, 8]} />
              <meshStandardMaterial
                color={config.canopyColors[0]}
                roughness={0.82}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
            {/* Middle Tier */}
            <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
              <coneGeometry args={[1.35, 1.6, 8]} />
              <meshStandardMaterial
                color={config.canopyColors[1]}
                roughness={0.82}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
            {/* Upper Tier */}
            <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.95, 1.4, 8]} />
              <meshStandardMaterial
                color={config.canopyColors[2]}
                roughness={0.82}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
            {/* Crown Spire */}
            <mesh position={[0, 2.8, 0]} castShadow receiveShadow>
              <coneGeometry args={[0.55, 1.1, 7]} />
              <meshStandardMaterial
                color={config.canopyColors[3]}
                roughness={0.82}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
          </>
        ) : variant === "willow" ? (
          // Drooping Weeping Willow Canopies
          <>
            {/* Central Dome */}
            <mesh position={[0, 0.6, 0]} scale={[1.4, 1.0, 1.4]} castShadow receiveShadow>
              <sphereGeometry args={[1.25, 12, 10]} />
              <meshStandardMaterial
                color={config.canopyColors[1]}
                roughness={0.82}
                flatShading={false}
              />
            </mesh>
            {/* Left Drooping Veil */}
            <mesh position={[-0.8, -0.3, 0.2]} scale={[0.85, 1.5, 0.85]} castShadow receiveShadow>
              <sphereGeometry args={[0.95, 10, 8]} />
              <meshStandardMaterial
                color={config.canopyColors[0]}
                roughness={0.82}
                flatShading={false}
              />
            </mesh>
            {/* Right Drooping Veil */}
            <mesh position={[0.8, -0.2, -0.2]} scale={[0.85, 1.45, 0.85]} castShadow receiveShadow>
              <sphereGeometry args={[0.95, 10, 8]} />
              <meshStandardMaterial
                color={config.canopyColors[2]}
                roughness={0.82}
                flatShading={false}
              />
            </mesh>
            {/* Forward Sunlit Drape */}
            <mesh position={[0.1, -0.4, 0.7]} scale={[0.75, 1.35, 0.75]} castShadow receiveShadow>
              <sphereGeometry args={[0.85, 10, 8]} />
              <meshStandardMaterial
                color={config.canopyColors[3]}
                roughness={0.82}
                flatShading={false}
              />
            </mesh>
          </>
        ) : (
          // Lush Broadleaf Oak & Birch Multi-Tiered Masses
          <>
            {/* Core Central Dome */}
            <mesh position={[0, 0.7, 0]} scale={[1.35, 1.05, 1.3]} castShadow receiveShadow>
              <sphereGeometry args={[1.3, 14, 12]} />
              <meshStandardMaterial
                color={config.canopyColors[1]}
                roughness={0.82}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
            {/* Lower Right Sunlit Shelf */}
            <mesh position={[0.85, 0.1, 0.4]} scale={[1.05, 0.85, 1.0]} castShadow receiveShadow>
              <sphereGeometry args={[1.05, 12, 10]} />
              <meshStandardMaterial
                color={config.canopyColors[2]}
                roughness={0.8}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
            {/* Lower Left Flank Shelf */}
            <mesh position={[-0.8, -0.05, -0.3]} scale={[0.95, 0.8, 0.95]} castShadow receiveShadow>
              <sphereGeometry args={[1.0, 12, 10]} />
              <meshStandardMaterial
                color={config.canopyColors[0]}
                roughness={0.84}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
            {/* Rear Framing Mass */}
            <mesh position={[-0.15, 0.35, -0.75]} scale={[1.0, 0.85, 0.9]} castShadow receiveShadow>
              <sphereGeometry args={[0.95, 10, 10]} />
              <meshStandardMaterial
                color={config.canopyColors[0]}
                roughness={0.84}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
            {/* Crown Peak Puff */}
            <mesh position={[0.1, 1.4, 0.05]} scale={[0.85, 0.8, 0.8]} castShadow receiveShadow>
              <sphereGeometry args={[0.9, 12, 10]} />
              <meshStandardMaterial
                color={config.canopyColors[3]}
                roughness={0.78}
                metalness={0.02}
                flatShading={false}
              />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}

/**
 * Curated natural tree distribution across the landscape.
 * Layered into Foreground Framing, Midground Groves, Stream Banks, and Background Ridge Silhouettes.
 */
export default function Trees() {
  const treeData = useMemo(() => {
    const rawPlacements: Array<{
      x: number;
      z: number;
      scale: number;
      rot: number;
      variant: TreeVariant;
    }> = [
      // 1. Foreground Framing Trees (frame the camera view naturally)
      { x: -8.5, z: 12, scale: 1.25, rot: 0.4, variant: "oak" },
      { x: 9.8, z: 14, scale: 1.3, rot: 1.1, variant: "birch" },
      { x: -6.5, z: 16, scale: 0.95, rot: 2.3, variant: "birch" },

      // 2. Midground Left Hills (framing the western meadows)
      { x: -12.5, z: 4, scale: 1.35, rot: 2.1, variant: "oak" },
      { x: -15.0, z: -6, scale: 1.45, rot: 0.8, variant: "oak" },
      { x: -17.0, z: -16, scale: 1.35, rot: 1.7, variant: "birch" },
      { x: -13.5, z: -25, scale: 1.2, rot: 3.0, variant: "oak" },
      { x: -14.0, z: -38, scale: 1.4, rot: 1.4, variant: "pine" },

      // 3. Midground Stream-Side Trees (weeping willows dipping toward water)
      { x: 10.5, z: 4, scale: 1.3, rot: 0.5, variant: "willow" },
      { x: 11.8, z: -7, scale: 1.25, rot: 2.3, variant: "willow" },
      { x: 13.8, z: -17, scale: 1.35, rot: 1.2, variant: "birch" },
      { x: 9.8, z: -24, scale: 1.2, rot: 0.8, variant: "willow" },

      // 4. Waterfall Bluff Framing Trees (Pines and sturdy Oaks on the rock bluff)
      { x: 21.0, z: -21, scale: 1.5, rot: 0.3, variant: "pine" },
      { x: 24.5, z: -32, scale: 1.6, rot: 2.6, variant: "pine" },
      { x: 13.5, z: -35, scale: 1.25, rot: 1.9, variant: "oak" },
      { x: 26.0, z: -25, scale: 1.4, rot: 1.1, variant: "birch" },

      // 5. Background Ridge Silhouettes (establishing vertical scale against mountains)
      { x: -24.0, z: -36, scale: 1.7, rot: 0.7, variant: "pine" },
      { x: -28.0, z: -22, scale: 1.75, rot: 1.5, variant: "oak" },
      { x: -26.0, z: 2, scale: 1.6, rot: 2.8, variant: "oak" },
      { x: 27.0, z: 8, scale: 1.65, rot: 0.2, variant: "pine" },
      { x: 29.0, z: -12, scale: 1.7, rot: 1.8, variant: "pine" },
      { x: -18.0, z: -46, scale: 1.6, rot: 0.9, variant: "pine" },
      { x: 16.0, z: -45, scale: 1.55, rot: 2.2, variant: "pine" },

      // 6. Natural Solitary Accent Trees along path bends
      { x: -5.4, z: -13, scale: 1.05, rot: 0.9, variant: "birch" },
      { x: 3.2, z: -15, scale: 0.9, rot: 1.8, variant: "birch" },
      { x: -3.8, z: -30, scale: 1.1, rot: 0.4, variant: "oak" },
    ];

    return rawPlacements.map((tree, idx) => {
      const y = getTerrainHeight(tree.x, tree.z);
      return {
        ...tree,
        pos: [tree.x, y, tree.z] as [number, number, number],
        windOffset: idx * 0.65,
      };
    });
  }, []);

  return (
    <group>
      {treeData.map((tree, index) => (
        <Tree
          key={index}
          position={tree.pos}
          scale={tree.scale}
          rotationY={tree.rot}
          variant={tree.variant}
          windOffset={tree.windOffset}
        />
      ))}
    </group>
  );
}
