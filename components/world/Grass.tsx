"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getPathX, getTerrainHeight, getDistToStream } from "./terrainMath";

export default function Grass() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeUniform = useMemo(() => ({ uTime: { value: 0 } }), []);

  // Crossed double-quad grass blade geometry
  const grassGeometry = useMemo(() => {
    const p1 = new THREE.PlaneGeometry(0.32, 0.42);
    p1.translate(0, 0.21, 0);

    const p2 = p1.clone();
    p2.rotateY(Math.PI / 2);

    const merged = new THREE.BufferGeometry();
    const pos1 = p1.attributes.position.array;
    const pos2 = p2.attributes.position.array;
    const uvs1 = p1.attributes.uv.array;
    const uvs2 = p2.attributes.uv.array;

    const mergedPos = new Float32Array(pos1.length + pos2.length);
    mergedPos.set(pos1, 0);
    mergedPos.set(pos2, pos1.length);

    const mergedUvs = new Float32Array(uvs1.length + uvs2.length);
    mergedUvs.set(uvs1, 0);
    mergedUvs.set(uvs2, uvs1.length);

    merged.setAttribute("position", new THREE.BufferAttribute(mergedPos, 3));
    merged.setAttribute("uv", new THREE.BufferAttribute(mergedUvs, 2));
    merged.computeVertexNormals();
    return merged;
  }, []);

  // Targeted natural distribution: clusters along path borders and rock footings
  const { count, transforms } = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];

    let seed = 31415;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const addTuft = (x: number, z: number, scale = 1.0) => {
      if (getDistToStream(x, z) < 1.7 && z > -28) return;
      const y = getTerrainHeight(x, z);

      const matrix = new THREE.Matrix4();
      const s = scale * (0.82 + rnd() * 0.4);
      const rotY = rnd() * Math.PI * 2;

      matrix.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)),
        new THREE.Vector3(s, s, s)
      );
      matrices.push(matrix);
    };

    // 1. Pathway Edges (soft organic transitional border)
    for (let z = 15; z >= -36; z -= 1.8) {
      const px = getPathX(z);
      // Left border tufts
      addTuft(px - 1.6 - rnd() * 0.6, z + (rnd() - 0.5) * 0.5, 0.95);
      if (rnd() > 0.4) {
        addTuft(px - 2.1 - rnd() * 0.7, z + (rnd() - 0.5) * 0.7, 1.1);
      }
      // Right border tufts
      addTuft(px + 1.6 + rnd() * 0.6, z + (rnd() - 0.5) * 0.5, 0.95);
      if (rnd() > 0.4) {
        addTuft(px + 2.1 + rnd() * 0.7, z + (rnd() - 0.5) * 0.7, 1.1);
      }
    }

    // 2. Curated Meadow Pockets
    const meadowAreas = [
      { cx: -5.5, cz: 7.0, count: 20, rad: 2.8 },
      { cx: -7.0, cz: -5.5, count: 24, rad: 3.2 },
      { cx: 6.8, cz: 3.8, count: 18, rad: 2.6 },
      { cx: 4.5, cz: -13.0, count: 22, rad: 3.0 },
      { cx: 13.0, cz: -20.0, count: 20, rad: 2.8 },
    ];

    meadowAreas.forEach((area) => {
      for (let i = 0; i < area.count; i++) {
        const r = rnd() * area.rad;
        const theta = rnd() * Math.PI * 2;
        addTuft(area.cx + Math.cos(theta) * r, area.cz + Math.sin(theta) * r, 0.95);
      }
    });

    return { count: matrices.length, transforms: matrices };
  }, []);

  React.useEffect(() => {
    if (!meshRef.current) return;
    transforms.forEach((mat, i) => {
      meshRef.current?.setMatrixAt(i, mat);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.computeBoundingSphere();
  }, [transforms]);

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
        float grassWind = sin(uTime * 2.0 + instanceMatrix[3][0] * 1.1 + instanceMatrix[3][2] * 0.8);
        float bend = max(transformed.y * 1.8, 0.0);
        transformed.x += grassWind * 0.065 * bend;
        transformed.z += cos(uTime * 1.5 + instanceMatrix[3][2] * 0.6) * 0.04 * bend;
        `
      );
    };
  }, [timeUniform]);

  useFrame((state) => {
    timeUniform.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[grassGeometry, undefined, count]}
      receiveShadow
      frustumCulled={false}
    >
      <meshStandardMaterial
        color="#598444"
        roughness={0.82}
        metalness={0.02}
        side={THREE.DoubleSide}
        onBeforeCompile={onBeforeCompile}
      />
    </instancedMesh>
  );
}
