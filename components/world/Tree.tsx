"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getTerrainHeight } from "./terrainMath";

interface SingleTreeProps {
  position: [number, number, number];
  scale?: number;
  rotationY?: number;
  variant?: "oak" | "birch" | "willow";
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

  // Gentle, slow natural wind breathing
  useFrame((state) => {
    if (!foliageGroupRef.current) return;
    const t = state.clock.getElapsedTime() * 0.9 + windOffset;
    foliageGroupRef.current.rotation.z = Math.sin(t) * 0.02;
    foliageGroupRef.current.rotation.x = Math.cos(t * 0.7) * 0.015;
  });

  const { trunkColor, foliageColors, canopyScales } = useMemo(() => {
    if (variant === "willow") {
      return {
        trunkColor: "#42362b",
        foliageColors: ["#4a683a", "#5a7a46", "#6c8e52"],
        canopyScales: [
          [1.4, 0.75, 1.35],
          [1.15, 0.95, 1.1],
          [1.0, 0.85, 1.0],
        ] as const,
      };
    }
    if (variant === "birch") {
      return {
        trunkColor: "#574e44",
        foliageColors: ["#3d5c32", "#4e7240", "#60884e"],
        canopyScales: [
          [1.05, 1.25, 1.05],
          [0.9, 1.1, 0.9],
          [0.8, 0.95, 0.8],
        ] as const,
      };
    }
    // Oak (default)
    return {
      trunkColor: "#443528",
      foliageColors: ["#38562f", "#476c3c", "#58804a"],
      canopyScales: [
        [1.45, 0.85, 1.35],
        [1.15, 0.7, 1.05],
        [1.0, 0.65, 0.95],
      ] as const,
    };
  }, [variant]);

  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      {/* Tapered Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[variant === "birch" ? 0.16 : 0.26, 0.42, 3.0, 7]}
        />
        <meshStandardMaterial
          color={trunkColor}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* Primary Branch Right */}
      <mesh
        position={[0.32, 2.5, 0.12]}
        rotation={[0.25, 0.2, -0.55]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.11, 0.18, 1.3, 6]} />
        <meshStandardMaterial
          color={trunkColor}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* Primary Branch Left */}
      <mesh
        position={[-0.26, 2.35, -0.16]}
        rotation={[-0.35, -0.4, 0.5]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.1, 0.16, 1.1, 6]} />
        <meshStandardMaterial
          color={trunkColor}
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* Layered Organic Foliage Canopies */}
      <group ref={foliageGroupRef} position={[0, 3.1, 0]}>
        {/* Main Canopy Dome */}
        <mesh
          position={[0, 0.6, 0]}
          scale={canopyScales[0]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1.25, 1]} />
          <meshStandardMaterial
            color={foliageColors[0]}
            roughness={0.82}
            metalness={0.02}
            flatShading
          />
        </mesh>

        {/* Flank Canopy Shelf (Right Sunlit) */}
        <mesh
          position={[0.65, 0.05, 0.3]}
          scale={canopyScales[1]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.95, 1]} />
          <meshStandardMaterial
            color={foliageColors[1]}
            roughness={0.82}
            metalness={0.02}
            flatShading
          />
        </mesh>

        {/* Flank Canopy Shelf (Left) */}
        <mesh
          position={[-0.6, -0.05, -0.25]}
          scale={canopyScales[2]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial
            color={foliageColors[2]}
            roughness={0.82}
            metalness={0.02}
            flatShading
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Curated nature trees placement across the landscape.
 * Layered into Foreground Framing, Midground Groves, and Background Silhouettes.
 * Preserves the central pathway and future portfolio landmark areas.
 */
export default function Trees() {
  const treeData = useMemo(() => {
    const rawPlacements: Array<{
      x: number;
      z: number;
      scale: number;
      rot: number;
      variant: "oak" | "birch" | "willow";
    }> = [
      // 1. Foreground Framing Trees (frame the edges of the view cleanly)
      { x: -8.5, z: 11, scale: 1.15, rot: 0.4, variant: "oak" },
      { x: 9.8, z: 13, scale: 1.2, rot: 1.1, variant: "birch" },

      // 2. Midground Groves along Left Hills (framing the western valley)
      { x: -12.5, z: 4, scale: 1.25, rot: 2.1, variant: "oak" },
      { x: -15.0, z: -6, scale: 1.35, rot: 0.8, variant: "oak" },
      { x: -17.0, z: -16, scale: 1.3, rot: 1.7, variant: "birch" },
      { x: -11.5, z: -24, scale: 1.1, rot: 3.0, variant: "oak" },

      // 3. Midground Stream-Side Trees (right side, soft willows near water)
      { x: 10.5, z: 4, scale: 1.2, rot: 0.5, variant: "willow" },
      { x: 11.5, z: -7, scale: 1.15, rot: 2.3, variant: "willow" },
      { x: 14.5, z: -17, scale: 1.3, rot: 1.2, variant: "birch" },

      // 4. Waterfall Bluff Framing Trees
      { x: 22.0, z: -22, scale: 1.45, rot: 0.3, variant: "oak" },
      { x: 24.0, z: -33, scale: 1.5, rot: 2.6, variant: "birch" },
      { x: 12.0, z: -36, scale: 1.15, rot: 1.9, variant: "oak" },

      // 5. Background Ridge Silhouettes (establishing depth and horizon scale)
      { x: -23.0, z: -34, scale: 1.6, rot: 0.7, variant: "oak" },
      { x: -27.0, z: -20, scale: 1.65, rot: 1.5, variant: "birch" },
      { x: -26.0, z: 3, scale: 1.5, rot: 2.8, variant: "oak" },
      { x: 26.0, z: 7, scale: 1.55, rot: 0.2, variant: "oak" },
      { x: 28.0, z: -10, scale: 1.6, rot: 1.8, variant: "birch" },

      // 6. Solitary Guiding Tree (accentuating the mid-distance path curve)
      { x: -5.2, z: -12, scale: 0.95, rot: 0.9, variant: "birch" },
    ];

    return rawPlacements.map((tree, idx) => {
      const y = getTerrainHeight(tree.x, tree.z);
      return {
        ...tree,
        pos: [tree.x, y, tree.z] as [number, number, number],
        windOffset: idx * 0.7,
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
