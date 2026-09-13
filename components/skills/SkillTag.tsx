"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Skill } from "@/data/skills";
import { selectSkill } from "../world/explorationStore";

interface SkillTagProps {
  skill: Skill;
  localOffset: [number, number, number];
  timingOffset?: number;
}

export default function SkillTag({
  skill,
  localOffset,
  timingOffset = 0,
}: SkillTagProps) {
  const plaqueGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: any) => {
    e?.stopPropagation?.();
    selectSkill(skill.id);
  };

  // Subtle natural pendulum sway in the wind
  useFrame((state) => {
    if (!plaqueGroupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle physical breeze swing
    const swayZ = Math.sin(time * 1.5 + timingOffset) * 0.055;
    const swayX = Math.cos(time * 1.1 + timingOffset) * 0.04;
    plaqueGroupRef.current.rotation.z = swayZ;
    plaqueGroupRef.current.rotation.x = swayX;

    // Smooth hover scale interpolation
    const targetScale = hovered ? 1.15 : 1.0;
    plaqueGroupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12
    );
  });

  return (
    <group position={localOffset}>
      {/* 1. Natural Suspension Cord / Vine hanging from branch */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.36, 4]} />
        <meshStandardMaterial
          color="#382d20"
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* Small Brass Ring / Hook on top of the plaque */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.035, 0.008, 8, 16]} />
        <meshStandardMaterial
          color="#a8926a"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>

      {/* 2. Floating Swaying Plaque Group */}
      <group ref={plaqueGroupRef} position={[0, -0.16, 0]}>
        {/* Physical 3D Wooden Signboard Plaque */}
        <mesh
          castShadow
          receiveShadow
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            if (typeof document !== "undefined") {
              document.body.style.cursor = "pointer";
            }
          }}
          onPointerOut={() => {
            setHovered(false);
            if (typeof document !== "undefined") {
              document.body.style.cursor = "auto";
            }
          }}
        >
          {/* Beveled wooden plaque slab */}
          <boxGeometry args={[0.74, 0.34, 0.04]} />
          <meshStandardMaterial
            color="#2e251b"
            emissive={skill.accentColor}
            emissiveIntensity={hovered ? 0.45 : 0.06}
            roughness={0.75}
            metalness={0.15}
          />
        </mesh>

        {/* Outer Accent Rim / Inscribed Border */}
        <mesh position={[0, 0, 0.022]}>
          <planeGeometry args={[0.7, 0.3]} />
          <meshStandardMaterial
            color="#221b14"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>

        {/* 3. High-Legibility Inscription & Tooltip */}
        <Html
          center
          distanceFactor={10}
          position={[0, 0, 0.035]}
          className="pointer-events-none select-none"
        >
          <div
            onClick={handleClick}
            onMouseEnter={() => {
              setHovered(true);
              if (typeof document !== "undefined") {
                document.body.style.cursor = "pointer";
              }
            }}
            onMouseLeave={() => {
              setHovered(false);
              if (typeof document !== "undefined") {
                document.body.style.cursor = "auto";
              }
            }}
            className="pointer-events-auto flex flex-col items-center cursor-pointer group"
          >
            {/* Plaque Front Text */}
            <div
              className={`flex items-center justify-center gap-1 px-2.5 py-1 transition-all duration-300 ${
                hovered ? "scale-105" : "scale-100"
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                style={{ backgroundColor: skill.accentColor, color: skill.accentColor }}
              />
              <span className="text-xs font-bold tracking-wide text-neutral-100 whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {skill.name}
              </span>
            </div>

            {/* Hover Tooltip / Mini Description */}
            <div
              className={`absolute -top-14 flex flex-col items-center transition-all duration-300 ${
                hovered
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <div className="flex flex-col items-center gap-0.5 whitespace-nowrap rounded-xl border border-white/15 bg-neutral-950/90 px-3 py-1.5 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">
                    {skill.name}
                  </span>
                  <span
                    className="rounded-full px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${skill.accentColor}25`,
                      color: skill.accentColor,
                    }}
                  >
                    {skill.category}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-300 max-w-[180px] truncate">
                  {skill.description}
                </span>
              </div>
              <div className="h-1.5 w-1.5 rotate-45 border-b border-r border-white/15 bg-neutral-950/90 -mt-1" />
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
