"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getTerrainHeight, getDistToStream, getPathX } from "./terrainMath";

export default function Flowers() {
  const flowerMeshRef = useRef<THREE.InstancedMesh>(null);
  const timeUniform = useMemo(() => ({ uTime: { value: 0 } }), []);

  // Merged Stem + 5-Petal Blossom 3D Geometry
  const flowerGeometry = useMemo(() => {
    // 1. Stem
    const stemGeom = new THREE.CylinderGeometry(0.012, 0.018, 0.32, 5);
    stemGeom.translate(0, 0.16, 0);

    // 2. 5-Petal Blossom Head
    const blossomGeom = new THREE.CylinderGeometry(0.11, 0.04, 0.06, 5);
    blossomGeom.translate(0, 0.34, 0);

    // 3. Flower Center Bud
    const budGeom = new THREE.SphereGeometry(0.04, 6, 6);
    budGeom.translate(0, 0.36, 0);

    // Combine into single buffer geometry
    const merged = new THREE.BufferGeometry();
    const sPos = stemGeom.attributes.position.array;
    const bPos = blossomGeom.attributes.position.array;
    const dPos = budGeom.attributes.position.array;

    const totalLen = sPos.length + bPos.length + dPos.length;
    const mergedPos = new Float32Array(totalLen);
    mergedPos.set(sPos, 0);
    mergedPos.set(bPos, sPos.length);
    mergedPos.set(dPos, sPos.length + bPos.length);

    merged.setAttribute("position", new THREE.BufferAttribute(mergedPos, 3));
    merged.computeVertexNormals();
    return merged;
  }, []);

  const { count, transforms, colors } = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const colorArray: THREE.Color[] = [];

    const flowerPalette = [
      new THREE.Color("#b3a3cf"), // English Lavender
      new THREE.Color("#f6d365"), // Buttercup Gold
      new THREE.Color("#e89eb0"), // Wild Rose Pink
      new THREE.Color("#f5f1eb"), // Pearl Clover
      new THREE.Color("#75b8d4"), // Cornflower Sky Blue
    ];

    let seed = 43210;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const addFlower = (x: number, z: number, palIdx = 0, scale = 1.0) => {
      if (getDistToStream(x, z) < 1.4 && z > -28) return;
      const y = getTerrainHeight(x, z);

      const m = new THREE.Matrix4();
      const s = scale * (0.8 + rnd() * 0.4);
      const rotY = rnd() * Math.PI * 2;
      const tiltX = (rnd() - 0.5) * 0.2;
      const tiltZ = (rnd() - 0.5) * 0.2;

      m.compose(
        new THREE.Vector3(x, y, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltX, rotY, tiltZ)),
        new THREE.Vector3(s, s, s)
      );

      matrices.push(m);
      colorArray.push(flowerPalette[palIdx % flowerPalette.length]);
    };

    // 1. Natural clusters along the pathway verges
    for (let z = 15; z >= -40; z -= 1.8) {
      const px = getPathX(z);
      const side = rnd() > 0.5 ? 1 : -1;
      const fx = px + side * (1.6 + rnd() * 0.8);
      const pal = Math.floor(rnd() * 5);

      // Clustered pocket of 3-5 flowers
      const clusterCount = 3 + Math.floor(rnd() * 3);
      for (let c = 0; c < clusterCount; c++) {
        addFlower(
          fx + (rnd() - 0.5) * 0.8,
          z + (rnd() - 0.5) * 0.8,
          pal,
          0.85 + rnd() * 0.3
        );
      }
    }

    // 2. Stream-side Wildflower Glades
    const streamGlades = [
      { x: 8.2, z: 3.5, pal: 0 },
      { x: 9.5, z: -5.5, pal: 1 },
      { x: 12.0, z: -15.0, pal: 2 },
      { x: 10.5, z: -23.0, pal: 4 },
    ];

    streamGlades.forEach((g) => {
      for (let i = 0; i < 18; i++) {
        const rad = rnd() * 1.8;
        const angle = rnd() * Math.PI * 2;
        addFlower(g.x + Math.cos(angle) * rad, g.z + Math.sin(angle) * rad, g.pal, 0.9 + rnd() * 0.3);
      }
    });

    // 3. Tree Footing Blossom Rings
    const treeBlossoms = [
      { x: -8.5, z: 12.0, pal: 3 },
      { x: 9.8, z: 14.0, pal: 0 },
      { x: -12.5, z: 4.0, pal: 1 },
      { x: 3.8, z: -11.5, pal: 2 },
      { x: -5.4, z: -13.0, pal: 4 },
      { x: 4.8, z: -21.8, pal: 0 }, // Knowledge Tree glade
      { x: 6.2, z: -29.0, pal: 2 }, // Certificate Grove glade
      { x: -7.2, z: -35.5, pal: 1 }, // About Camp glade
    ];

    treeBlossoms.forEach((tb) => {
      for (let i = 0; i < 16; i++) {
        const rad = 1.0 + rnd() * 1.6;
        const angle = rnd() * Math.PI * 2;
        addFlower(tb.x + Math.cos(angle) * rad, tb.z + Math.sin(angle) * rad, tb.pal, 0.85 + rnd() * 0.3);
      }
    });

    return { count: matrices.length, transforms: matrices, colors: colorArray };
  }, []);

  useEffect(() => {
    if (!flowerMeshRef.current) return;
    transforms.forEach((m, idx) => {
      flowerMeshRef.current?.setMatrixAt(idx, m);
      flowerMeshRef.current?.setColorAt(idx, colors[idx]);
    });
    flowerMeshRef.current.instanceMatrix.needsUpdate = true;
    if (flowerMeshRef.current.instanceColor) {
      flowerMeshRef.current.instanceColor.needsUpdate = true;
    }
    flowerMeshRef.current.computeBoundingSphere();
  }, [transforms, colors]);

  // Gentle wind sway in vertex shader
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
        float h = clamp(position.y / 0.36, 0.0, 1.0);
        float sway = sin(uTime * 1.9 + transformed.x * 2.0 + transformed.z * 1.8) * 0.045 * h;
        transformed.x += sway;
        transformed.z += sway * 0.7;
        `
      );
    };
  }, [timeUniform]);

  useFrame((state) => {
    timeUniform.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <instancedMesh
      ref={flowerMeshRef}
      args={[flowerGeometry, undefined, count]}
      receiveShadow
      frustumCulled={false}
    >
      <meshStandardMaterial
        roughness={0.72}
        metalness={0.02}
        onBeforeCompile={onBeforeCompile}
      />
    </instancedMesh>
  );
}
