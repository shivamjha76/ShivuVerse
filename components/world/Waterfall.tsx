"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { getTerrainHeight, WATERFALL_CENTER } from "./terrainMath";

export default function Waterfall() {
  const fallMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const mistPointsRef = useRef<THREE.Points>(null);
  const poolMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const groundY = useMemo(
    () => getTerrainHeight(WATERFALL_CENTER.x, WATERFALL_CENTER.z),
    []
  );

  const timeUniform = useMemo(() => ({ uTime: { value: 0 } }), []);

  // Upper Tier Cascade: Drops from crest (y=7.4) to middle shelf (y=4.0)
  const upperCascadeGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(2.2, 3.4, 12, 16);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      // Natural arching curve over the rock lip
      const normalizedY = (y + 1.7) / 3.4; // 0 at bottom, 1 at top
      const curve = Math.sin(normalizedY * Math.PI) * 0.38;
      pos.setZ(i, curve);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Lower Tier Cascade: Flared veil dropping from middle shelf (y=4.0) to pool (y=0.5)
  const lowerCascadeGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(3.4, 3.6, 16, 18);
    const pos = geom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const normalizedY = (y + 1.8) / 3.6;
      // Flare out wider towards bottom plunge
      const flare = (1.0 - normalizedY) * 0.25;
      const x = pos.getX(i);
      pos.setX(i, x * (1.0 + flare));
      const curve = Math.sin(normalizedY * Math.PI) * 0.32;
      pos.setZ(i, curve);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  // Plunge pool with concentric ripple geometry
  const poolGeometry = useMemo(() => {
    return new THREE.CircleGeometry(3.8, 28);
  }, []);

  // Mist spray particles drifting upwards
  const { mistGeometry } = useMemo(() => {
    const count = 42;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.4 + Math.random() * 2.8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.3 + Math.random() * 2.0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { mistGeometry: geom };
  }, []);

  // Downward rushing turbulent water shader
  const onBeforeCompileWaterfall = useMemo(() => {
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
        // High-speed rushing water turbulence and vertical stretch
        float rush = sin(transformed.y * 3.8 - uTime * 8.0) * 0.05 +
                     cos(transformed.x * 6.5 + uTime * 5.0) * 0.035;
        transformed.z += rush;
        // Soft feathering at left/right edges
        float edgeDamp = 1.0 - pow(abs(uv.x - 0.5) * 2.0, 3.0);
        transformed.z *= edgeDamp;
        `
      );
    };
  }, [timeUniform]);

  // Pool ripple shader
  const onBeforeCompilePool = useMemo(() => {
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
        float dist = length(transformed.xy);
        float ripple = sin(dist * 7.5 - uTime * 4.5) * 0.035 * max(1.0 - dist / 3.8, 0.0);
        transformed.z += ripple;
        `
      );
    };
  }, [timeUniform]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    timeUniform.uTime.value = t;

    if (mistPointsRef.current) {
      const pos = mistPointsRef.current.geometry.attributes.position;
      const count = pos.count;
      for (let i = 0; i < count; i++) {
        let y = pos.getY(i) + 0.014;
        if (y > 2.4) {
          y = 0.3 + (i % 6) * 0.12;
        }
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group position={[WATERFALL_CENTER.x, groundY, WATERFALL_CENTER.z]}>
      {/* Terraced Rock Shelves flanking and supporting the waterfall */}
      {/* Upper Lip Shelf */}
      <mesh position={[0.2, 7.2, -1.3]} scale={[4.2, 1.4, 2.6]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#554f47" roughness={0.9} metalness={0.04} flatShading />
      </mesh>

      {/* Middle Stepped Terrace */}
      <mesh position={[-0.9, 3.9, -0.9]} scale={[4.4, 1.5, 2.7]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#4c4740" roughness={0.9} metalness={0.04} flatShading />
      </mesh>

      {/* Flank Rock Right */}
      <mesh position={[2.2, 3.2, -0.4]} scale={[2.6, 3.4, 2.4]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#5e574f" roughness={0.9} metalness={0.04} flatShading />
      </mesh>

      {/* Flank Rock Left */}
      <mesh position={[-2.4, 2.8, -0.2]} scale={[2.4, 3.2, 2.2]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#58524a" roughness={0.9} metalness={0.04} flatShading />
      </mesh>

      {/* Base Gorge Foundation */}
      <mesh position={[0.4, 1.1, -0.7]} scale={[5.2, 1.8, 3.4]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#524c44" roughness={0.9} metalness={0.04} flatShading />
      </mesh>

      {/* Upper Waterfall Cascade Sheet */}
      <mesh
        geometry={upperCascadeGeometry}
        position={[0, 5.7, 0.2]}
        castShadow={false}
        receiveShadow
      >
        <meshStandardMaterial
          ref={fallMaterialRef}
          color="#d0f4fa"
          emissive="#4ab5c4"
          emissiveIntensity={0.42}
          roughness={0.12}
          metalness={0.18}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
          onBeforeCompile={onBeforeCompileWaterfall}
        />
      </mesh>

      {/* Intermediate Foam Shelf */}
      <mesh position={[0, 3.95, 0.45]} scale={[2.8, 0.15, 0.9]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#e6faff"
          emissive="#7ad4e0"
          emissiveIntensity={0.5}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Lower Waterfall Cascade Sheet (Flared Veil) */}
      <mesh
        geometry={lowerCascadeGeometry}
        position={[0, 2.0, 0.65]}
        castShadow={false}
        receiveShadow
      >
        <meshStandardMaterial
          color="#c8f2f8"
          emissive="#3eaebb"
          emissiveIntensity={0.45}
          roughness={0.12}
          metalness={0.18}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
          onBeforeCompile={onBeforeCompileWaterfall}
        />
      </mesh>

      {/* Plunge Pool with Concentric Ripples */}
      <mesh
        geometry={poolGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.06, 1.4]}
        receiveShadow
      >
        <meshStandardMaterial
          ref={poolMaterialRef}
          color="#42a8b8"
          emissive="#12515b"
          emissiveIntensity={0.32}
          roughness={0.1}
          metalness={0.22}
          transparent
          opacity={0.85}
          onBeforeCompile={onBeforeCompilePool}
        />
      </mesh>

      {/* Rising Atmospheric Mist Spray */}
      <points ref={mistPointsRef} geometry={mistGeometry} position={[0, 0, 1.4]}>
        <pointsMaterial
          size={0.28}
          color="#f2fcfe"
          transparent
          opacity={0.36}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
