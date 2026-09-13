"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import {
  TERRAIN_SIZE,
  TERRAIN_SEGMENTS,
  getPathX,
  getTerrainHeight,
  getDistToStream,
} from "./terrainMath";

interface TerrainProps {
  size?: number;
  segments?: number;
}

export default function Terrain({
  size = TERRAIN_SIZE,
  segments = TERRAIN_SEGMENTS,
}: TerrainProps) {
  // Generate procedural rolling terrain with central path and stream depression
  const terrainGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = geom.attributes.position;
    const count = pos.count;
    const colors = new Float32Array(count * 3);

    // Natural stylized fantasy color palette: lush greens, sunlit fields, warm loam, rock cliffs
    const colorPath = new THREE.Color("#9e8f7a");       // Warm sandy loam/gravel path
    const colorPathMoss = new THREE.Color("#6e825a");   // Mossy transitional earth
    const colorStreamBed = new THREE.Color("#35423c");  // Moist dark silt and river stone
    const colorRockCliff = new THREE.Color("#5e584f");  // Weathered granite rock
    const colorMeadowDeep = new THREE.Color("#385e32"); // Lush deep meadow hollows
    const colorMeadowMid = new THREE.Color("#4d783d");  // Vibrant rolling pasture green
    const colorRidgeHigh = new THREE.Color("#6b9452");  // Golden-green sunlit hill crests
    const tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const worldX = x;
      const worldZ = -y;

      const elevation = getTerrainHeight(worldX, worldZ);
      pos.setZ(i, elevation);
    }

    geom.computeVertexNormals();

    // Calculate vertex colors based on height, path, stream, cliff, and slope
    const normals = geom.attributes.normal;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const worldX = x;
      const worldZ = -y;

      const pathX = getPathX(worldZ);
      const distToPath = Math.abs(worldX - pathX);
      const pathFactor = Math.min(Math.max((distToPath - 2.8) / 7.5, 0), 1);
      const pathEdgeFactor = Math.min(Math.max((distToPath - 2.0) / 2.2, 0), 1);

      const distToStream = getDistToStream(worldX, worldZ);

      // Slope factor (Z attribute represents normal.y in world space)
      const slope = Math.min(Math.max(normals.getZ(i), 0), 1);
      const normalizedHeight = Math.min(Math.max((z + 1.0) / 9.0, 0), 1);

      // Base meadow gradient: deep meadow in lowlands, warm golden-green on ridges
      if (normalizedHeight < 0.42) {
        tempColor.copy(colorMeadowDeep).lerp(colorMeadowMid, normalizedHeight / 0.42);
      } else {
        tempColor
          .copy(colorMeadowMid)
          .lerp(colorRidgeHigh, (normalizedHeight - 0.42) / 0.58);
      }

      // Exposed rocky soil on steep slopes
      if (slope < 0.82) {
        tempColor.lerp(colorRockCliff, (0.82 - slope) * 1.6);
      }

      // Waterfall cliff coloration
      const distToCliff = Math.hypot(worldX - 17.5, worldZ - (-31.5));
      if (distToCliff < 13) {
        const cliffFactor = 1 - distToCliff / 13;
        tempColor.lerp(colorRockCliff, cliffFactor * 0.92);
      }

      // Stream bed moist dark stone
      if (distToStream < 3.8 && worldZ > -30) {
        const zBlend = Math.min(Math.max((worldZ - (-30)) / 3.5, 0), 1);
        const streamFactor = (1 - distToStream / 3.8) * zBlend;
        tempColor.lerp(colorStreamBed, streamFactor * 0.92);
      }

      // Transitional mossy earth around path
      if (pathFactor < 0.8) {
        tempColor.lerp(colorPathMoss, (0.8 - pathFactor) * 0.7);
      }

      // Warm gravelly path bed
      tempColor.lerp(colorPath, (1 - pathEdgeFactor) * 0.88);

      colors[i * 3] = tempColor.r;
      colors[i * 3 + 1] = tempColor.g;
      colors[i * 3 + 2] = tempColor.b;
    }

    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [size, segments]);

  return (
    <mesh
      geometry={terrainGeometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        vertexColors
        roughness={0.84}
        metalness={0.02}
        flatShading={false}
      />
    </mesh>
  );
}
