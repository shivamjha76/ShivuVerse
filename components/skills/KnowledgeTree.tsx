"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { SKILLS, Skill, TreeBranchId } from "@/data/skills";
import SkillTag from "./SkillTag";
import { getTerrainHeight } from "../world/terrainMath";

export default function KnowledgeTree() {
  const treeRoot = useMemo(() => ({ x: 4.8, z: -21.8 }), []);
  const rootGroundY = useMemo(
    () => getTerrainHeight(treeRoot.x, treeRoot.z),
    [treeRoot]
  );

  const foliageGroupRef = useRef<THREE.Group>(null);
  const firefliesRef = useRef<THREE.Points>(null);

  // Branch definitions and spatial anchoring
  const branchAnchors: Record<
    TreeBranchId,
    { origin: [number, number, number]; direction: [number, number, number] }
  > = useMemo(
    () => ({
      "core-cs": {
        origin: [-2.2, 4.1, 0.9],
        direction: [-0.65, -0.1, 0.45],
      },
      programming: {
        origin: [2.2, 4.0, 0.8],
        direction: [0.65, -0.08, 0.4],
      },
      web: {
        origin: [-2.8, 5.6, -0.4],
        direction: [-0.55, -0.12, -0.3],
      },
      backend: {
        origin: [0.3, 5.9, 1.6],
        direction: [0.35, -0.1, 0.65],
      },
      database: {
        origin: [2.7, 5.4, -0.6],
        direction: [0.6, -0.1, -0.4],
      },
      tools: {
        origin: [0.1, 7.2, 0.2],
        direction: [-0.25, -0.15, 0.5],
      },
      roots: {
        origin: [-1.4, 2.2, 1.2],
        direction: [-0.4, -0.2, 0.4],
      },
    }),
    []
  );

  // Group skills by branch and automatically calculate physical tag positions
  const tagsData = useMemo(() => {
    const grouped: Record<TreeBranchId, Skill[]> = {
      "core-cs": [],
      programming: [],
      web: [],
      backend: [],
      database: [],
      tools: [],
      roots: [],
    };

    SKILLS.forEach((skill) => {
      if (grouped[skill.branch]) {
        grouped[skill.branch].push(skill);
      } else {
        grouped["tools"].push(skill);
      }
    });

    const result: Array<{
      skill: Skill;
      localOffset: [number, number, number];
      timingOffset: number;
    }> = [];

    (Object.keys(grouped) as TreeBranchId[]).forEach((branchId) => {
      const skillsInBranch = grouped[branchId];
      const anchor = branchAnchors[branchId];
      const count = skillsInBranch.length;

      skillsInBranch.forEach((skill, idx) => {
        // Space tags out organically along the branch
        const t = (idx + 1) / (count + 0.8);
        const lateralJitter = Math.sin(idx * 2.3) * 0.35;
        const verticalJitter = (idx % 2 === 0 ? 0.12 : -0.15);

        const x = anchor.origin[0] + anchor.direction[0] * (t * 2.2) + lateralJitter;
        const y = anchor.origin[1] + anchor.direction[1] * (t * 1.6) + verticalJitter;
        const z = anchor.origin[2] + anchor.direction[2] * (t * 2.2);

        result.push({
          skill,
          localOffset: [x, y, z],
          timingOffset: idx * 0.65 + Math.random() * 0.5,
        });
      });
    });

    return result;
  }, [branchAnchors]);

  // Subtle magical firefly particles drifting around the ancient crown
  const { fireflyGeometry, fireflyData } = useMemo(() => {
    const count = 36;
    const positions = new Float32Array(count * 3);
    const data: Array<{ angle: number; radius: number; speed: number; baseY: number }> = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 4.5;
      const baseY = 3.5 + Math.random() * 5.2;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = baseY;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      data.push({
        angle,
        radius,
        speed: 0.25 + Math.random() * 0.35,
        baseY,
      });
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { fireflyGeometry: geom, fireflyData: data };
  }, []);

  // Frame animations: subtle foliage breathing & drifting firefly particles
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Foliage gentle breeze sway
    if (foliageGroupRef.current) {
      foliageGroupRef.current.rotation.z = Math.sin(time * 0.8) * 0.018;
      foliageGroupRef.current.rotation.x = Math.cos(time * 0.6) * 0.014;
    }

    // Fireflies slow ethereal dance
    if (firefliesRef.current) {
      const pos = firefliesRef.current.geometry.attributes.position;
      for (let i = 0; i < fireflyData.length; i++) {
        const item = fireflyData[i];
        const currentAngle = item.angle + time * item.speed * 0.4;
        const currentRadius = item.radius + Math.sin(time * 0.8 + i) * 0.35;
        const currentY = item.baseY + Math.sin(time * 1.2 + i * 2) * 0.4;

        pos.setX(i, Math.cos(currentAngle) * currentRadius);
        pos.setY(i, currentY);
        pos.setZ(i, Math.sin(currentAngle) * currentRadius);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group position={[treeRoot.x, rootGroundY, treeRoot.z]}>
      {/* 1. Ancient Massive Trunk with Buttress Root Base */}
      {/* Main Trunk Body */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 1.55, 5.2, 10]} />
        <meshStandardMaterial
          color="#35281b"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Massive Spreading Buttress Roots gripping the ground */}
      {([
        { pos: [-1.2, 0.4, 0.8], rot: [0.2, 0.5, -0.6], scale: [0.55, 1.8, 0.6] },
        { pos: [1.3, 0.35, 0.7], rot: [0.1, -0.6, 0.55], scale: [0.5, 1.7, 0.55] },
        { pos: [-0.6, 0.3, -1.2], rot: [-0.55, -0.4, 0.2], scale: [0.6, 1.9, 0.5] },
        { pos: [0.9, 0.3, -1.1], rot: [-0.5, 0.5, -0.3], scale: [0.55, 1.8, 0.5] },
        { pos: [0.0, 0.25, 1.4], rot: [0.6, 0.0, 0.0], scale: [0.65, 1.6, 0.55] },
      ] as const).map((root, index) => (
        <mesh
          key={index}
          position={root.pos as any}
          rotation={root.rot as any}
          scale={root.scale as any}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.32, 0.52, 1.6, 7]} />
          <meshStandardMaterial
            color="#322518"
            roughness={0.94}
            metalness={0.02}
          />
        </mesh>
      ))}

      {/* 2. Major Sculpted Primary Branch Limbs */}
      {/* Limb 1: West / Core-CS */}
      <mesh position={[-1.2, 4.3, 0.45]} rotation={[0.3, 0.35, -0.75]} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.55, 2.9, 7]} />
        <meshStandardMaterial color="#35281b" roughness={0.92} />
      </mesh>

      {/* Limb 2: East / Programming */}
      <mesh position={[1.2, 4.2, 0.4]} rotation={[0.25, -0.4, 0.7]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.54, 2.8, 7]} />
        <meshStandardMaterial color="#35281b" roughness={0.92} />
      </mesh>

      {/* Limb 3: North-West / Web */}
      <mesh position={[-1.4, 5.6, -0.3]} rotation={[-0.4, -0.5, -0.6]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.44, 2.7, 7]} />
        <meshStandardMaterial color="#35281b" roughness={0.92} />
      </mesh>

      {/* Limb 4: South-Central / Backend */}
      <mesh position={[0.2, 5.8, 0.9]} rotation={[0.65, 0.1, 0.15]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.45, 2.6, 7]} />
        <meshStandardMaterial color="#35281b" roughness={0.92} />
      </mesh>

      {/* Limb 5: North-East / Database */}
      <mesh position={[1.4, 5.5, -0.4]} rotation={[-0.35, 0.6, 0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.42, 2.7, 7]} />
        <meshStandardMaterial color="#35281b" roughness={0.92} />
      </mesh>

      {/* Central Upper Trunk Pillar */}
      <mesh position={[0, 6.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.85, 3.2, 8]} />
        <meshStandardMaterial color="#35281b" roughness={0.92} />
      </mesh>

      {/* 3. Rich, Sculpted Layered Foliage Canopy Volumes */}
      <group ref={foliageGroupRef}>
        {/* Ancient Main Crown Dome */}
        <mesh position={[0, 8.2, 0]} scale={[3.0, 1.7, 2.8]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#3d6335"
            roughness={0.82}
            metalness={0.02}
            flatShading
          />
        </mesh>

        {/* Branch Canopy Shelf: West (Core-CS) */}
        <mesh position={[-2.4, 4.8, 0.8]} scale={[2.0, 1.2, 1.9]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#47733e" roughness={0.82} flatShading />
        </mesh>

        {/* Branch Canopy Shelf: East (Programming) */}
        <mesh position={[2.4, 4.7, 0.7]} scale={[1.9, 1.2, 1.8]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#4a7841" roughness={0.82} flatShading />
        </mesh>

        {/* Branch Canopy Shelf: North-West (Web) */}
        <mesh position={[-2.7, 6.4, -0.5]} scale={[2.1, 1.3, 1.9]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.25, 1]} />
          <meshStandardMaterial color="#3b6033" roughness={0.82} flatShading />
        </mesh>

        {/* Branch Canopy Shelf: South (Backend) */}
        <mesh position={[0.3, 6.6, 1.7]} scale={[2.0, 1.25, 1.9]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#518247" roughness={0.82} flatShading />
        </mesh>

        {/* Branch Canopy Shelf: North-East (Database) */}
        <mesh position={[2.6, 6.2, -0.6]} scale={[2.0, 1.2, 1.8]} castShadow receiveShadow>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#44703a" roughness={0.82} flatShading />
        </mesh>
      </group>

      {/* 4. Magical Firefly / Spore Particles */}
      <points ref={firefliesRef} geometry={fireflyGeometry}>
        <pointsMaterial
          size={0.24}
          color="#ffe8a3"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 5. Soft Warm Golden-Hour Heartwood Illumination */}
      <pointLight
        position={[0, 5.5, 0.2]}
        color="#ffe2b0"
        intensity={1.35}
        distance={12}
        decay={2}
      />

      {/* 6. Automatically Mapped Physical Skill Tags */}
      {tagsData.map(({ skill, localOffset, timingOffset }) => (
        <SkillTag
          key={skill.id}
          skill={skill}
          localOffset={localOffset}
          timingOffset={timingOffset}
        />
      ))}
    </group>
  );
}
