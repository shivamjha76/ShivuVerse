"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getStreamX, getTerrainHeight } from "./terrainMath";

export default function Stream() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const timeUniform = useMemo(() => ({ uTime: { value: 0 } }), []);

  // Generate curved natural ribbon mesh for stream surface
  const waterGeometry = useMemo(() => {
    const steps = 120;
    const zStart = -27; // Plunge pool connection
    const zEnd = 24; // Foreground
    const baseWidth = 2.3;

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const z = zStart + progress * (zEnd - zStart);
      const centerX = getStreamX(z);

      // Width expands gently downstream
      const currentWidth =
        baseWidth + Math.sin(z * 0.14) * 0.35 + progress * 0.45;
      const halfWidth = currentWidth * 0.5;

      const centerGroundY = getTerrainHeight(centerX, z);
      const waterY = centerGroundY + 0.19;

      const segmentsAcross = 6;
      for (let j = 0; j <= segmentsAcross; j++) {
        const u = j / segmentsAcross;
        const xOffset = (u - 0.5) * currentWidth;
        const vx = centerX + xOffset;
        // Subtle concave dip towards stream center
        const dip = (1 - Math.pow((u - 0.5) * 2, 2)) * 0.04;
        const vy = waterY - dip;

        positions.push(vx, vy, z);
        uvs.push(u, progress * 16);
      }

      if (i < steps) {
        const row = i * (segmentsAcross + 1);
        const nextRow = (i + 1) * (segmentsAcross + 1);
        for (let j = 0; j < segmentsAcross; j++) {
          indices.push(row + j, nextRow + j, row + j + 1);
          indices.push(row + j + 1, nextRow + j, nextRow + j + 1);
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  // GPU ripple wave animation down the stream
  const onBeforeCompile = useMemo(() => {
    return (shader: THREE.WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = timeUniform.uTime;
      shader.vertexShader = `
        uniform float uTime;
        ${shader.vertexShader}
      `;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
        #include <begin_vertex>
        // Gentle flowing wave ripples down the stream
        float wave1 = sin(transformed.z * 1.7 + transformed.x * 2.4 - uTime * 2.4) * 0.022;
        float wave2 = cos(transformed.z * 3.2 - uTime * 3.2) * 0.012;
        transformed.y += wave1 + wave2;
        `
      );
    };
  }, [timeUniform]);

  useFrame((state) => {
    timeUniform.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} geometry={waterGeometry} receiveShadow>
      <meshStandardMaterial
        ref={materialRef}
        color="#3ca2b4"
        emissive="#0e454f"
        emissiveIntensity={0.28}
        roughness={0.09}
        metalness={0.24}
        transparent
        opacity={0.85}
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}
