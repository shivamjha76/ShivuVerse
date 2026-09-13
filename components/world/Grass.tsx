"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getPathX, getTerrainHeight, getDistToStream } from "./terrainMath";

export default function Grass() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const timeUniform = useMemo(() => ({ uTime: { value: 0 } }), []);

  // 3-way crossed curved blade clump geometry with root-to-tip vertex colors
  const grassGeometry = useMemo(() => {
    const bladeW = 0.32;
    const bladeH = 0.46;
    const p1 = new THREE.PlaneGeometry(bladeW, bladeH, 1, 3);
    p1.translate(0, bladeH * 0.5, 0);

    const p2 = p1.clone();
    p2.rotateY(Math.PI / 3);

    const p3 = p1.clone();
    p3.rotateY((Math.PI * 2) / 3);

    // Merge planes into single buffer
    const merged = new THREE.BufferGeometry();
    const pos1 = p1.attributes.position.array;
    const pos2 = p2.attributes.position.array;
    const pos3 = p3.attributes.position.array;

    const totalVerts = (pos1.length + pos2.length + pos3.length) / 3;
    const mergedPos = new Float32Array(pos1.length * 3);
    mergedPos.set(pos1, 0);
    mergedPos.set(pos2, pos1.length);
    mergedPos.set(pos3, pos1.length * 2);

    const colors = new Float32Array(totalVerts * 3);
    const rootColor = new THREE.Color("#2d5225"); // Deep rich meadow green
    const tipColor = new THREE.Color("#7bb84c");  // Warm sunlit golden-green
    const tempCol = new THREE.Color();

    for (let i = 0; i < totalVerts; i++) {
      const y = mergedPos[i * 3 + 1];
      const normY = Math.min(Math.max(y / bladeH, 0), 1);
      tempCol.copy(rootColor).lerp(tipColor, normY * normY);
      colors[i * 3] = tempCol.r;
      colors[i * 3 + 1] = tempCol.g;
      colors[i * 3 + 2] = tempCol.b;
    }

    merged.setAttribute("position", new THREE.BufferAttribute(mergedPos, 3));
    merged.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    merged.computeVertexNormals();
    return merged;
  }, []);

  // Natural organic distribution: dense path edging, rock footings, meadow pockets
  const { count, transforms } = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];

    let seed = 31415;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const addTuft = (x: number, z: number, scale = 1.0) => {
      if (getDistToStream(x, z) < 1.6 && z > -28) return;
      const y = getTerrainHeight(x, z);

      const m = new THREE.Matrix4();
      const s = scale * (0.8 + rnd() * 0.45);
      const rotY = rnd() * Math.PI * 2;

      m.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rotY, 0)),
        new THREE.Vector3(s, s * (0.85 + rnd() * 0.3), s)
      );
      matrices.push(m);
    };

    // 1. Pathway Edges (Continuous lush border lining the path)
    for (let z = 16; z >= -42; z -= 1.1) {
      const px = getPathX(z);
      // Left border tufts (varied distance from path center)
      addTuft(px - 1.45 - rnd() * 0.5, z + (rnd() - 0.5) * 0.4, 0.95);
      if (rnd() > 0.3) {
        addTuft(px - 1.85 - rnd() * 0.6, z + (rnd() - 0.5) * 0.6, 1.1);
      }

      // Right border tufts
      addTuft(px + 1.45 + rnd() * 0.5, z + (rnd() - 0.5) * 0.4, 0.95);
      if (rnd() > 0.3) {
        addTuft(px + 1.85 + rnd() * 0.6, z + (rnd() - 0.5) * 0.6, 1.1);
      }
    }

    // 2. Stream Bank Fringe
    for (let z = 22; z >= -25; z -= 1.8) {
      const sx = getPathX(z) + 7.5; // Near stream
      addTuft(sx + (rnd() - 0.5) * 2.0, z + (rnd() - 0.5) * 0.8, 1.15);
      addTuft(sx + (rnd() - 0.5) * 2.5, z + (rnd() - 0.5) * 0.8, 1.0);
    }

    // 3. Meadow Clearings & Tree Bases
    const meadowClusters = [
      { x: -6.5, z: 8.5, count: 20 },
      { x: 8.5, z: 10.0, count: 20 },
      { x: -11.0, z: -4.0, count: 25 },
      { x: 5.5, z: -8.0, count: 22 },
      { x: -5.0, z: -18.0, count: 24 },
      { x: 7.5, z: -25.0, count: 26 },
      { x: -5.5, z: -32.0, count: 22 },
    ];

    meadowClusters.forEach((c) => {
      for (let i = 0; i < c.count; i++) {
        const angle = rnd() * Math.PI * 2;
        const rad = rnd() * 2.8;
        addTuft(c.x + Math.cos(angle) * rad, c.z + Math.sin(angle) * rad, 1.0 + rnd() * 0.35);
      }
    });

    return { count: matrices.length, transforms: matrices };
  }, []);

  React.useEffect(() => {
    if (!meshRef.current) return;
    transforms.forEach((matrix, idx) => {
      meshRef.current?.setMatrixAt(idx, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.computeBoundingSphere();
  }, [transforms]);

  // Gentle wind swaying vertex shader modification
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
        // Natural wind sway affecting the upper half of grass blades
        float heightFactor = clamp(position.y / 0.45, 0.0, 1.0);
        float sway = sin(uTime * 2.2 + transformed.x * 1.5 + transformed.z * 1.2) * 0.055 * heightFactor;
        float flutter = cos(uTime * 3.4 + transformed.z * 2.5) * 0.025 * heightFactor;
        transformed.x += sway + flutter;
        transformed.z += sway * 0.6;
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
        vertexColors
        roughness={0.78}
        metalness={0.02}
        side={THREE.DoubleSide}
        onBeforeCompile={onBeforeCompile}
      />
    </instancedMesh>
  );
}
