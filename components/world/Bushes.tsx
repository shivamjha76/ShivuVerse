"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { getTerrainHeight, getPathX, getDistToStream } from "./terrainMath";

export default function Bushes() {
  const bushMeshRef = useRef<THREE.InstancedMesh>(null);

  const { transforms, colors } = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const colorList: THREE.Color[] = [];

    const bushPalette = [
      new THREE.Color("#365e2b"), // Deep forest green
      new THREE.Color("#48753a"), // Vibrant field shrub
      new THREE.Color("#5a8c49"), // Sunlit leaf green
      new THREE.Color("#6c9955"), // Golden-hour bright olive
    ];

    let seed = 54321;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const addBush = (
      x: number,
      z: number,
      scale = 1.0,
      colorIdx = 1
    ) => {
      // Don't place inside the stream
      if (getDistToStream(x, z) < 1.6 && z > -28) return;

      const y = getTerrainHeight(x, z) + 0.18 * scale;
      const m = new THREE.Matrix4();
      const s = scale * (0.85 + rnd() * 0.35);
      const rotY = rnd() * Math.PI * 2;

      m.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)),
        new THREE.Vector3(s * 1.25, s * 0.85, s * 1.15)
      );
      matrices.push(m);
      colorList.push(bushPalette[colorIdx % bushPalette.length]);
    };

    // 1. Bushes clustered around tree bases
    const treeBases = [
      [-8.5, 12], [9.8, 14], [-6.5, 16], [-12.5, 4], [-15.0, -6],
      [-17.0, -16], [-13.5, -25], [10.5, 4], [11.8, -7], [13.8, -17],
      [9.8, -24], [21.0, -21], [13.5, -35], [-5.4, -13], [3.2, -15],
      [-3.8, -30], [-7.5, -27.5], [-7.2, -35.5], [6.2, -29.0]
    ];

    treeBases.forEach(([tx, tz], i) => {
      // 2-3 bushes per tree cluster
      const angle1 = rnd() * Math.PI * 2;
      const dist1 = 0.8 + rnd() * 0.7;
      addBush(tx + Math.cos(angle1) * dist1, tz + Math.sin(angle1) * dist1, 0.65 + rnd() * 0.35, i % 4);

      const angle2 = angle1 + 1.8 + rnd() * 0.8;
      const dist2 = 0.9 + rnd() * 0.6;
      addBush(tx + Math.cos(angle2) * dist2, tz + Math.sin(angle2) * dist2, 0.5 + rnd() * 0.3, (i + 1) % 4);
    });

    // 2. Bushes flanking path curves (set back 2.2m from path center)
    for (let z = 14; z >= -38; z -= 3.5) {
      const px = getPathX(z);
      const side = rnd() > 0.5 ? 1 : -1;
      const bx = px + side * (2.2 + rnd() * 0.9);
      addBush(bx, z + (rnd() - 0.5) * 1.2, 0.7 + rnd() * 0.35, Math.floor(rnd() * 4));
    }

    // 3. Rock outcropping fringe bushes
    const rockSpots = [
      [14.5, -28.0], [17.5, -31.0], [21.0, -26.0], [12.0, -31.5],
      [-7.5, 10.5], [9.0, 12.5], [-11.5, 2.5], [11.0, -6.5]
    ];

    rockSpots.forEach(([rx, rz], idx) => {
      addBush(rx + 0.6, rz - 0.5, 0.75 + rnd() * 0.3, idx % 4);
    });

    return { transforms: matrices, colors: colorList };
  }, []);

  useEffect(() => {
    if (!bushMeshRef.current) return;
    transforms.forEach((m, idx) => {
      bushMeshRef.current?.setMatrixAt(idx, m);
      bushMeshRef.current?.setColorAt(idx, colors[idx]);
    });
    bushMeshRef.current.instanceMatrix.needsUpdate = true;
    if (bushMeshRef.current.instanceColor) {
      bushMeshRef.current.instanceColor.needsUpdate = true;
    }
    bushMeshRef.current.computeBoundingSphere();
  }, [transforms, colors]);

  return (
    <instancedMesh
      ref={bushMeshRef}
      args={[undefined, undefined, transforms.length]}
      receiveShadow
      castShadow
      frustumCulled={false}
    >
      <dodecahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial
        roughness={0.84}
        metalness={0.02}
        flatShading={false}
      />
    </instancedMesh>
  );
}
