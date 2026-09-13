"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { getPathX, getStreamX, getTerrainHeight } from "./terrainMath";

export default function Rocks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Curated natural rock placements with organic clustering and varied forms
  const rockTransforms = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];

    let seed = 76543;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const addRock = (
      x: number,
      z: number,
      baseScale: number,
      scaleAxes = [1, 1, 1],
      rotOffset = [0, 0, 0]
    ) => {
      // Submerge stone partially into ground for natural bedding
      const y = getTerrainHeight(x, z) + scaleAxes[1] * baseScale * 0.22;
      const matrix = new THREE.Matrix4();
      const sx = baseScale * scaleAxes[0] * (0.85 + rnd() * 0.3);
      const sy = baseScale * scaleAxes[1] * (0.85 + rnd() * 0.3);
      const sz = baseScale * scaleAxes[2] * (0.85 + rnd() * 0.3);

      const rot = new THREE.Euler(
        rotOffset[0] + (rnd() - 0.5) * 0.35,
        rotOffset[1] + rnd() * Math.PI * 2,
        rotOffset[2] + (rnd() - 0.5) * 0.35
      );

      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(rot),
        new THREE.Vector3(sx, sy, sz)
      );
      matrices.push(matrix);
    };

    // 1. Stream Bank Rocks: Natural clusters of 1 anchor stone + 1-2 smaller river pebbles
    for (let z = 20; z >= -24; z -= 3.6) {
      const sx = getStreamX(z);
      // Left river bank
      const leftDist = 1.35 + rnd() * 0.5;
      addRock(sx - leftDist, z, 0.6 + rnd() * 0.4, [1.3, 0.55, 1.1]);
      if (rnd() > 0.4) {
        addRock(sx - leftDist - 0.5, z + 0.4, 0.35 + rnd() * 0.2, [1.1, 0.45, 1.0]);
      }

      // Right river bank
      const rightDist = 1.4 + rnd() * 0.5;
      addRock(sx + rightDist, z + 0.3, 0.65 + rnd() * 0.45, [1.2, 0.6, 1.15]);
      if (rnd() > 0.5) {
        addRock(sx + rightDist + 0.45, z - 0.4, 0.32 + rnd() * 0.22, [1.0, 0.4, 0.95]);
      }
    }

    // 2. Waterfall Basin: Natural rocky gorge encircling the plunge pool
    const waterfallAngles = 12;
    for (let i = 0; i < waterfallAngles; i++) {
      const angle = (i / waterfallAngles) * Math.PI * 2;
      const dist = 3.0 + rnd() * 2.0;
      const rx = 16.2 + Math.cos(angle) * dist;
      const rz = -28.2 + Math.sin(angle) * dist;
      addRock(rx, rz, 1.0 + rnd() * 1.1, [1.25, 0.9, 1.3]);
    }

    // 3. Pathway Border Accents: Grounded stones nestled into grass at turning points
    const pathStoneZones = [14, 8, 2, -5, -13, -21, -29, -37];
    pathStoneZones.forEach((z) => {
      const px = getPathX(z);
      const side = Math.sin(z * 0.7) > 0 ? 1 : -1;
      const rx = px + side * (1.8 + rnd() * 0.6);
      addRock(rx, z, 0.5 + rnd() * 0.4, [1.2, 0.65, 1.05]);
      if (rnd() > 0.4) {
        addRock(rx + side * 0.4, z + 0.3, 0.3 + rnd() * 0.2, [1.0, 0.5, 0.9]);
      }
    });

    // 4. Hillside & Tree Bedrock Formations (grounding the western hills and trees)
    const hillBoulders = [
      { x: -9.5, z: 9.5, s: 1.1 },
      { x: -13.0, z: 1.5, s: 1.5 },
      { x: -16.5, z: -9.0, s: 1.9 },
      { x: -19.0, z: -23.0, s: 2.3 },
      { x: 14.0, z: 11.0, s: 1.3 },
      { x: 16.5, z: -3.0, s: 1.6 },
      { x: 19.5, z: -13.0, s: 2.0 },
      { x: 4.8, z: -31.0, s: 1.2 },
    ];
    hillBoulders.forEach((b) => {
      addRock(b.x, b.z, b.s, [1.25, 0.8, 1.1]);
    });

    return matrices;
  }, []);

  React.useEffect(() => {
    if (!meshRef.current) return;
    rockTransforms.forEach((mat, i) => {
      meshRef.current?.setMatrixAt(i, mat);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.computeBoundingSphere();
  }, [rockTransforms]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, rockTransforms.length]}
      castShadow
      receiveShadow
      frustumCulled={false}
    >
      <dodecahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#696359"
        roughness={0.88}
        metalness={0.04}
        flatShading
      />
    </instancedMesh>
  );
}
