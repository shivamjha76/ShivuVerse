"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { getPathX, getTerrainHeight } from "./terrainMath";
import LandmarkSign from "./LandmarkSign";

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

      // Organic width variation along the path
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

    // Naturally scattered stone pavers along the main path
    const stones: THREE.Matrix4[] = [];
    const stoneCount = 85;
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

    // Branch offshoot stepping stones to clearings
    const branches = [
      // To Social Garden [7.4, -4.2]
      { from: [getPathX(-4.2), -4.2], to: [5.2, -4.2], steps: 5 },
      // To Project Workshop [-7.8, -10.5]
      { from: [getPathX(-10.5), -10.5], to: [-5.6, -10.5], steps: 5 },
      // To Knowledge Tree [4.8, -21.8]
      { from: [getPathX(-21.8), -21.8], to: [3.4, -21.8], steps: 4 },
      // To Certificate Grove [6.2, -29.0]
      { from: [getPathX(-29.0), -29.0], to: [4.4, -29.0], steps: 4 },
      // To About Me Camp [-7.2, -35.5]
      { from: [getPathX(-35.5), -35.5], to: [-5.4, -35.5], steps: 4 },
    ];

    branches.forEach((b) => {
      for (let st = 1; st <= b.steps; st++) {
        const t = st / (b.steps + 1);
        const bx = b.from[0] + (b.to[0] - b.from[0]) * t;
        const bz = b.from[1] + (b.to[1] - b.from[1]) * t;
        const by = getTerrainHeight(bx, bz) + 0.04;

        const m = new THREE.Matrix4();
        m.compose(
          new THREE.Vector3(bx, by, bz),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, t * 1.5, 0)),
          new THREE.Vector3(0.42, 0.06, 0.4)
        );
        stones.push(m);
      }
    });

    return { ribbonGeometry: geom, stoneTransforms: stones };
  }, []);

  const stoneMeshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!stoneMeshRef.current) return;
    stoneTransforms.forEach((matrix, idx) => {
      stoneMeshRef.current?.setMatrixAt(idx, matrix);
    });
    stoneMeshRef.current.instanceMatrix.needsUpdate = true;
    stoneMeshRef.current.computeBoundingSphere();
  }, [stoneTransforms]);

  return (
    <group>
      {/* 1. Main Garden Entrance Landmark Sign */}
      <LandmarkSign
        position={[1.6, 15.2]}
        rotationY={0.15}
        title="Main Garden"
        subtitle="ShivuVerse Sanctuary"
        accentColor="#fbbf24"
      />

      {/* 2. Naturally walked garden pathway bed */}
      <mesh geometry={ribbonGeometry} receiveShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* 3. Embedded weathered limestone flagstones & branch stepping stones */}
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

      {/* 4. Subtle Trail Guide Lanterns along key curves */}
      {[
        { z: 6.5, side: 1 },
        { z: -16.0, side: -1 },
        { z: -25.2, side: 1 },
        { z: -32.8, side: -1 },
      ].map((pt, i) => {
        const px = getPathX(pt.z) + pt.side * 1.6;
        const py = getTerrainHeight(px, pt.z);
        return (
          <group key={i} position={[px, py, pt.z]}>
            {/* Small Timber Post */}
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.7, 6]} />
              <meshStandardMaterial color="#423428" roughness={0.85} />
            </mesh>
            {/* Hanging Lantern */}
            <mesh position={[0, 0.72, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.04, 0.12, 6]} />
              <meshStandardMaterial
                color="#ffb347"
                emissive="#ff8800"
                emissiveIntensity={0.8}
                roughness={0.3}
              />
            </mesh>
            <pointLight
              position={[0, 0.75, 0]}
              color="#ffaa44"
              intensity={0.65}
              distance={3.6}
              decay={2}
            />
          </group>
        );
      })}
    </group>
  );
}
