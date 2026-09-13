"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { getPathX, getTerrainHeight } from "./terrainMath";

export default function Pathway() {
  // Generate an organic ribbon mesh with natural edges for the walked garden path
  const { ribbonGeometry, stoneTransforms } = useMemo(() => {
    const steps = 150;
    const zStart = 18;
    const zEnd = -46;

    const positions: number[] = [];
    const uvs: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    const baseColor = new THREE.Color("#a29380"); // Warm sandy earth
    const edgeColor = new THREE.Color("#6b7d5f"); // Soft mossy transitional border
    const tempColor = new THREE.Color();

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const z = zStart + progress * (zEnd - zStart);

      // Natural asymmetrical curve variation
      const rawCenterX = getPathX(z);
      const centerJitter = Math.sin(z * 0.22) * 0.18;
      const centerX = rawCenterX + centerJitter;

      // Organic width variation along the path (wider near foreground & junctions, narrower in bends)
      const currentWidth =
        2.2 + Math.sin(z * 0.16) * 0.45 + Math.cos(z * 0.07) * 0.25;
      const halfWidth = currentWidth * 0.5;

      // Left edge with subtle natural jitter
      const leftEdgeJitter = Math.sin(z * 0.4) * 0.12;
      const leftX = centerX - halfWidth + leftEdgeJitter;
      const leftY = getTerrainHeight(leftX, z) + 0.032;
      positions.push(leftX, leftY, z);
      uvs.push(0, progress * 22);
      tempColor.copy(edgeColor);
      colors.push(tempColor.r, tempColor.g, tempColor.b);

      // Center-left (slightly convex crown)
      const clX = centerX - halfWidth * 0.38;
      const clY = getTerrainHeight(clX, z) + 0.046;
      positions.push(clX, clY, z);
      uvs.push(0.3, progress * 22);
      tempColor.copy(baseColor).multiplyScalar(0.96);
      colors.push(tempColor.r, tempColor.g, tempColor.b);

      // Center-right
      const crX = centerX + halfWidth * 0.38;
      const crY = getTerrainHeight(crX, z) + 0.046;
      positions.push(crX, crY, z);
      uvs.push(0.7, progress * 22);
      tempColor.copy(baseColor);
      colors.push(tempColor.r, tempColor.g, tempColor.b);

      // Right edge with subtle natural jitter
      const rightEdgeJitter = Math.cos(z * 0.35) * 0.12;
      const rightX = centerX + halfWidth + rightEdgeJitter;
      const rightY = getTerrainHeight(rightX, z) + 0.032;
      positions.push(rightX, rightY, z);
      uvs.push(1, progress * 22);
      tempColor.copy(edgeColor);
      colors.push(tempColor.r, tempColor.g, tempColor.b);

      // Triangulate quads
      if (i < steps) {
        const row = i * 4;
        const nextRow = (i + 1) * 4;

        indices.push(row, nextRow, row + 1);
        indices.push(row + 1, nextRow, nextRow + 1);

        indices.push(row + 1, nextRow + 1, row + 2);
        indices.push(row + 2, nextRow + 1, nextRow + 2);

        indices.push(row + 2, nextRow + 2, row + 3);
        indices.push(row + 3, nextRow + 2, nextRow + 3);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();

    // Naturally scattered stone pavers
    const stones: THREE.Matrix4[] = [];
    const stoneCount = 75;
    for (let s = 0; s < stoneCount; s++) {
      const z = zStart - 1.5 - (s / stoneCount) * (zStart - zEnd - 3);
      const centerX = getPathX(z);
      // Gentle stride-like offset
      const lateral = (Math.sin(s * 7.7) * 0.35 + Math.cos(s * 3.3) * 0.3) * 0.75;
      const x = centerX + lateral;
      const y = getTerrainHeight(x, z) + 0.044;

      const matrix = new THREE.Matrix4();
      const scaleX = 0.38 + Math.abs(Math.sin(s * 2.9)) * 0.28;
      const scaleZ = 0.36 + Math.abs(Math.cos(s * 4.1)) * 0.26;
      const scaleY = 0.065;
      const rotY = (s * 1.618) % Math.PI;

      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)),
        new THREE.Vector3(scaleX, scaleY, scaleZ)
      );
      stones.push(matrix);
    }

    return { ribbonGeometry: geom, stoneTransforms: stones };
  }, []);

  const stoneMeshRef = React.useRef<THREE.InstancedMesh>(null);

  React.useEffect(() => {
    if (!stoneMeshRef.current) return;
    stoneTransforms.forEach((matrix, idx) => {
      stoneMeshRef.current?.setMatrixAt(idx, matrix);
    });
    stoneMeshRef.current.instanceMatrix.needsUpdate = true;
    stoneMeshRef.current.computeBoundingSphere();
  }, [stoneTransforms]);

  return (
    <group>
      {/* Naturally walked garden pathway bed */}
      <mesh geometry={ribbonGeometry} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* Embedded weathered limestone flagstones */}
      <instancedMesh
        ref={stoneMeshRef}
        args={[undefined, undefined, stoneTransforms.length]}
        receiveShadow
        castShadow
        frustumCulled={false}
      >
        <cylinderGeometry args={[0.5, 0.56, 0.1, 7]} />
        <meshStandardMaterial
          color="#b5ab9e"
          roughness={0.84}
          metalness={0.03}
        />
      </instancedMesh>
    </group>
  );
}
