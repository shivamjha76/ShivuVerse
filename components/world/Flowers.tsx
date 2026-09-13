"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getTerrainHeight, getDistToStream } from "./terrainMath";

export default function Flowers() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const windUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  // Curated, painterly flower clusters (subtle, natural, non-overwhelming)
  const { count, transforms, colors } = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const colorArray: THREE.Color[] = [];

    // Subtle, natural wildflower color palette
    const colorPalette = [
      new THREE.Color("#9b8eb3"), // Soft English Lavender
      new THREE.Color("#e4c77c"), // Warm Buttercup Cream
      new THREE.Color("#c9818d"), // Delicate Wild Rose
      new THREE.Color("#f0eae0"), // Pearl White Clover
      new THREE.Color("#6fa1b6"), // Soft Cornflower Blue
    ];

    // 5 curated natural clusters (kept away from blocking the path)
    const curatedClusters: Array<{
      cx: number;
      cz: number;
      radius: number;
      count: number;
    }> = [
      // 1. Nestled at the foot of the midground left tree
      { cx: -6.5, cz: -4, radius: 1.8, count: 26 },

      // 2. Grassy meadow beside stream bank
      { cx: 7.8, cz: 3.5, radius: 1.7, count: 24 },

      // 3. Sunny hillside pocket off the pathway bend
      { cx: 3.8, cz: -11.5, radius: 2.0, count: 28 },

      // 4. Approach meadow near the waterfall rock bluff
      { cx: 12.5, cz: -22, radius: 2.2, count: 26 },

      // 5. Left foreground framing meadow (safely to the side)
      { cx: -4.8, cz: 6.5, radius: 1.6, count: 22 },
    ];

    let seed = 43210;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    curatedClusters.forEach((cluster) => {
      for (let i = 0; i < cluster.count; i++) {
        const r = pseudoRandom() * cluster.radius;
        const angle = pseudoRandom() * Math.PI * 2;
        const x = cluster.cx + Math.cos(angle) * r;
        const z = cluster.cz + Math.sin(angle) * r;

        // Ensure not placed in stream
        if (getDistToStream(x, z) < 1.8 && z > -28) continue;

        const y = getTerrainHeight(x, z) + 0.02;

        const matrix = new THREE.Matrix4();
        const scale = 0.5 + pseudoRandom() * 0.45; // Dainty, natural scale
        const rotY = pseudoRandom() * Math.PI * 2;

        matrix.compose(
          new THREE.Vector3(x, y, z),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)),
          new THREE.Vector3(scale, scale, scale)
        );

        matrices.push(matrix);

        const col = colorPalette[Math.floor(pseudoRandom() * colorPalette.length)];
        colorArray.push(col);
      }
    });

    return {
      count: matrices.length,
      transforms: matrices,
      colors: colorArray,
    };
  }, []);

  React.useEffect(() => {
    if (!meshRef.current) return;
    transforms.forEach((matrix, i) => {
      meshRef.current?.setMatrixAt(i, matrix);
      meshRef.current?.setColorAt(i, colors[i]);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    meshRef.current.computeBoundingSphere();
  }, [transforms, colors]);

  useFrame((state) => {
    windUniforms.uTime.value = state.clock.getElapsedTime();
  });

  // Smooth GPU wind sway
  const onBeforeCompile = useMemo(() => {
    return (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = windUniforms.uTime;
      shader.vertexShader = `
        uniform float uTime;
        ${shader.vertexShader}
      `;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        float windWave = sin(uTime * 1.6 + instanceMatrix[3][0] * 0.7 + instanceMatrix[3][2] * 0.5);
        float swayFactor = max(transformed.y * 1.5, 0.0);
        transformed.x += windWave * 0.05 * swayFactor;
        transformed.z += cos(uTime * 1.3 + instanceMatrix[3][2] * 0.4) * 0.035 * swayFactor;
        `
      );
    };
  }, [windUniforms]);

  const flowerGeometry = useMemo(() => {
    const blossom = new THREE.DodecahedronGeometry(0.08, 0);
    blossom.translate(0, 0.24, 0);

    const stem = new THREE.CylinderGeometry(0.01, 0.014, 0.24, 4);
    stem.translate(0, 0.12, 0);

    const merged = new THREE.BufferGeometry();
    const posBlossom = blossom.attributes.position.array;
    const posStem = stem.attributes.position.array;

    const mergedPositions = new Float32Array(posBlossom.length + posStem.length);
    mergedPositions.set(posBlossom, 0);
    mergedPositions.set(posStem, posBlossom.length);

    merged.setAttribute("position", new THREE.BufferAttribute(mergedPositions, 3));
    merged.computeVertexNormals();
    return merged;
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[flowerGeometry, undefined, count]}
      receiveShadow
      castShadow
      frustumCulled={false}
    >
      <meshStandardMaterial
        ref={materialRef}
        roughness={0.72}
        metalness={0.04}
        onBeforeCompile={onBeforeCompile}
      />
    </instancedMesh>
  );
}
