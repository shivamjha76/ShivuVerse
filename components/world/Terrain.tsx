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

    // Richer, natural color palette: vibrant greens, warm sandy path, weathered granite
    const colorPath = new THREE.Color("#9e907d"); // Lighter warm sandy loam/gravel
    const colorStreamBed = new THREE.Color("#3d4944"); // Moist river silt and dark stone
    const colorRockCliff = new THREE.Color("#67625a"); // Weathered warm granite
    const colorMeadowLow = new THREE.Color("#446c3d"); // Lush deep meadow green
    const colorMeadowMid = new THREE.Color("#568249"); // Vibrant sunlit field grass
    const colorRidgeHigh = new THREE.Color("#739857"); // Warm golden-green hill crest
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
      const pathFactor = Math.min(Math.max((distToPath - 3.2) / 8.0, 0), 1);

      const distToStream = getDistToStream(worldX, worldZ);

      // Slope factor (Z attribute represents normal.y in world space)
      const slope = Math.min(Math.max(normals.getZ(i), 0), 1);
      const normalizedHeight = Math.min(Math.max((z + 1.0) / 9.0, 0), 1);

      // Base meadow gradient: deep meadow in lowlands, warm golden-green on ridges
      if (normalizedHeight < 0.45) {
        tempColor.copy(colorMeadowLow).lerp(colorMeadowMid, normalizedHeight / 0.45);
      } else {
        tempColor
          .copy(colorMeadowMid)
          .lerp(colorRidgeHigh, (normalizedHeight - 0.45) / 0.55);
      }

      // Exposed rocky soil on steep slopes
      if (slope < 0.8) {
        tempColor.lerp(colorRockCliff, (0.8 - slope) * 1.5);
      }

      // Waterfall cliff coloration
      const distToCliff = Math.hypot(worldX - 17.5, worldZ - (-31.5));
      if (distToCliff < 13) {
        const cliffFactor = 1 - distToCliff / 13;
        tempColor.lerp(colorRockCliff, cliffFactor * 0.9);
      }

      // Stream bed moist dark stone with smooth entry taper
      if (distToStream < 3.8 && worldZ > -30) {
        const zBlend = Math.min(Math.max((worldZ - (-30)) / 3.5, 0), 1);
        const streamFactor = (1 - distToStream / 3.8) * zBlend;
        tempColor.lerp(colorStreamBed, streamFactor * 0.9);
      }

      // Blend lighter, warm earthy path
      tempColor.lerp(colorPath, (1 - pathFactor) * 0.86);

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
        roughness={0.86}
        metalness={0.02}
        flatShading={false}
      />
    </mesh>
  );
}
