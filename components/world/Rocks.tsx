"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { getPathX, getStreamX, getTerrainHeight } from "./terrainMath";

export default function Rocks() {
  const boulderMeshRef = useRef<THREE.InstancedMesh>(null);
  const cragMeshRef = useRef<THREE.InstancedMesh>(null);
  const shelfMeshRef = useRef<THREE.InstancedMesh>(null);

  const { boulderTransforms, cragTransforms, shelfTransforms } = useMemo(() => {
    const boulders: THREE.Matrix4[] = [];
    const crags: THREE.Matrix4[] = [];
    const shelves: THREE.Matrix4[] = [];

    let seed = 76543;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const composeMatrix = (
      x: number,
      z: number,
      baseScale: number,
      scaleAxes: [number, number, number],
      rotOffset: [number, number, number] = [0, 0, 0]
    ) => {
      const y = getTerrainHeight(x, z) + scaleAxes[1] * baseScale * 0.18;
      const m = new THREE.Matrix4();
      const sx = baseScale * scaleAxes[0] * (0.85 + rnd() * 0.3);
      const sy = baseScale * scaleAxes[1] * (0.85 + rnd() * 0.3);
      const sz = baseScale * scaleAxes[2] * (0.85 + rnd() * 0.3);

      const rot = new THREE.Euler(
        rotOffset[0] + (rnd() - 0.5) * 0.3,
        rotOffset[1] + rnd() * Math.PI * 2,
        rotOffset[2] + (rnd() - 0.5) * 0.3
      );

      m.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(rot),
        new THREE.Vector3(sx, sy, sz)
      );
      return m;
    };

    // 1. Stream Bank Rocks (Smooth River Boulders + Small Pebbles)
    for (let z = 22; z >= -26; z -= 2.8) {
      const sx = getStreamX(z);
      // Left river bank
      const leftDist = 1.35 + rnd() * 0.6;
      boulders.push(composeMatrix(sx - leftDist, z, 0.75 + rnd() * 0.45, [1.4, 0.7, 1.15]));
      if (rnd() > 0.35) {
        boulders.push(composeMatrix(sx - leftDist - 0.45, z + 0.3, 0.4 + rnd() * 0.25, [1.1, 0.5, 1.0]));
      }

      // Right river bank
      const rightDist = 1.45 + rnd() * 0.6;
      boulders.push(composeMatrix(sx + rightDist, z + 0.2, 0.8 + rnd() * 0.5, [1.3, 0.75, 1.2]));
      if (rnd() > 0.4) {
        boulders.push(composeMatrix(sx + rightDist + 0.5, z - 0.3, 0.38 + rnd() * 0.25, [1.0, 0.45, 0.95]));
      }
    }

    // 2. Waterfall Cliff Formations (Massive Angular Crags & Layered Shelves)
    const waterfallCliffs = [
      { x: 14.5, z: -29.5, s: 2.4, axes: [1.8, 1.4, 1.6] as [number, number, number] },
      { x: 18.2, z: -32.5, s: 3.2, axes: [2.2, 1.8, 1.9] as [number, number, number] },
      { x: 21.0, z: -27.0, s: 2.8, axes: [1.9, 1.5, 1.7] as [number, number, number] },
      { x: 12.8, z: -32.0, s: 2.0, axes: [1.6, 1.2, 1.4] as [number, number, number] },
      { x: 19.5, z: -25.5, s: 1.8, axes: [1.5, 1.1, 1.3] as [number, number, number] },
      { x: 23.5, z: -34.0, s: 2.9, axes: [2.0, 1.6, 1.8] as [number, number, number] },
    ];

    waterfallCliffs.forEach((c) => {
      crags.push(composeMatrix(c.x, c.z, c.s, c.axes));
      shelves.push(composeMatrix(c.x + 0.4, c.z - 0.5, c.s * 0.75, [1.6, 0.4, 1.4]));
    });

    // 3. Path-Side Granite Rocks (Guiding path curves naturally)
    for (let z = 16; z >= -40; z -= 4.2) {
      const px = getPathX(z);
      const side = rnd() > 0.5 ? 1 : -1;
      const dist = 1.9 + rnd() * 0.9;
      const rx = px + side * dist;

      if (rnd() > 0.3) {
        crags.push(composeMatrix(rx, z, 0.65 + rnd() * 0.45, [1.3, 0.85, 1.1]));
      } else {
        shelves.push(composeMatrix(rx, z, 0.6 + rnd() * 0.35, [1.5, 0.45, 1.2]));
      }
    }

    // 4. Hillside & Tree Footing Boulders
    const anchorSpots = [
      { x: -8.0, z: 11.2, s: 1.1 },
      { x: 9.2, z: 13.5, s: 1.2 },
      { x: -12.0, z: 3.5, s: 1.4 },
      { x: -14.2, z: -6.5, s: 1.5 },
      { x: 11.0, z: -7.5, s: 1.3 },
      { x: -6.8, z: -26.5, s: 1.2 },
      { x: 4.2, z: -22.5, s: 1.3 },
      { x: -4.8, z: -36.5, s: 1.4 },
    ];

    anchorSpots.forEach((spot) => {
      boulders.push(composeMatrix(spot.x, spot.z, spot.s, [1.3, 0.8, 1.2]));
      if (rnd() > 0.4) {
        crags.push(composeMatrix(spot.x + 0.5, spot.z - 0.4, spot.s * 0.65, [1.1, 0.7, 1.0]));
      }
    });

    return {
      boulderTransforms: boulders,
      cragTransforms: crags,
      shelfTransforms: shelves,
    };
  }, []);

  useEffect(() => {
    if (boulderMeshRef.current) {
      boulderTransforms.forEach((m, i) => boulderMeshRef.current?.setMatrixAt(i, m));
      boulderMeshRef.current.instanceMatrix.needsUpdate = true;
      boulderMeshRef.current.computeBoundingSphere();
    }
    if (cragMeshRef.current) {
      cragTransforms.forEach((m, i) => cragMeshRef.current?.setMatrixAt(i, m));
      cragMeshRef.current.instanceMatrix.needsUpdate = true;
      cragMeshRef.current.computeBoundingSphere();
    }
    if (shelfMeshRef.current) {
      shelfTransforms.forEach((m, i) => shelfMeshRef.current?.setMatrixAt(i, m));
      shelfMeshRef.current.instanceMatrix.needsUpdate = true;
      shelfMeshRef.current.computeBoundingSphere();
    }
  }, [boulderTransforms, cragTransforms, shelfTransforms]);

  return (
    <group>
      {/* 1. River-Smoothed Boulders (Stream & Meadow Anchors) */}
      <instancedMesh
        ref={boulderMeshRef}
        args={[undefined, undefined, boulderTransforms.length]}
        receiveShadow
        castShadow
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial
          color="#696359"
          roughness={0.86}
          metalness={0.04}
          flatShading={false}
        />
      </instancedMesh>

      {/* 2. Angular Granite Crags (Cliffs & Outcroppings) */}
      <instancedMesh
        ref={cragMeshRef}
        args={[undefined, undefined, cragTransforms.length]}
        receiveShadow
        castShadow
        frustumCulled={false}
      >
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#575147"
          roughness={0.88}
          metalness={0.05}
          flatShading={true}
        />
      </instancedMesh>

      {/* 3. Layered Stone Shelves (Waterfall & Pathway Steps) */}
      <instancedMesh
        ref={shelfMeshRef}
        args={[undefined, undefined, shelfTransforms.length]}
        receiveShadow
        castShadow
        frustumCulled={false}
      >
        <boxGeometry args={[1.4, 0.45, 1.2]} />
        <meshStandardMaterial
          color="#756d61"
          roughness={0.84}
          metalness={0.03}
        />
      </instancedMesh>
    </group>
  );
}
