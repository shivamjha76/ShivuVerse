"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Project } from "@/data/projects";
import { selectProject } from "../world/explorationStore";

interface ProjectDisplayProps {
  project: Project;
  worldPosition: [number, number, number];
  rotationY?: number;
  timingOffset?: number;
}

export default function ProjectDisplay({
  project,
  worldPosition,
  rotationY = 0,
  timingOffset = 0,
}: ProjectDisplayProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frameMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: any) => {
    e?.stopPropagation?.();
    selectProject(project.id);
  };

  // Subtle floating and hover scale animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle floating breathing motion
    const floatY = Math.sin(time * 1.4 + timingOffset) * 0.055;
    groupRef.current.position.y = worldPosition[1] + floatY;

    // Smooth hover scale interpolation
    const targetScale = hovered ? 1.07 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group position={[worldPosition[0], 0, worldPosition[2]]} rotation={[0, rotationY, 0]}>
      {/* 1. Grounded Rustic Timber / Stone Workshop Plinth */}
      <mesh position={[0, worldPosition[1] - 0.72, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.95, 0.46, 0.65]} />
        <meshStandardMaterial
          color="#4e4337"
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* Stone Pedestal Top Trim */}
      <mesh position={[0, worldPosition[1] - 0.48, 0]} receiveShadow>
        <boxGeometry args={[1.05, 0.06, 0.75]} />
        <meshStandardMaterial
          color="#3d362c"
          roughness={0.92}
          metalness={0.04}
        />
      </mesh>

      {/* 2. Floating Physical 3D Display Frame */}
      <group ref={groupRef} position={[0, worldPosition[1], 0]}>
        {/* Clickable Outer Frame Mesh */}
        <mesh
          ref={frameMeshRef}
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
          {/* Framed Tablet Slab */}
          <boxGeometry args={[1.56, 1.06, 0.08]} />
          <meshStandardMaterial
            color="#22201d"
            emissive={project.accentColor}
            emissiveIntensity={hovered ? 0.45 : 0.08}
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>

        {/* Outer Accent Rim */}
        <mesh position={[0, 0, 0.042]}>
          <planeGeometry args={[1.5, 1.0]} />
          <meshStandardMaterial
            color="#181614"
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>

        {/* 3. Embedded Interactive Display Surface */}
        <Html
          center
          distanceFactor={11}
          position={[0, 0, 0.06]}
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
            className="pointer-events-auto flex w-60 flex-col items-center justify-between rounded-xl border border-white/10 bg-neutral-950/85 p-3.5 shadow-2xl backdrop-blur-md cursor-pointer transition-all duration-300"
            style={{
              borderColor: hovered ? `${project.accentColor}80` : "rgba(255,255,255,0.12)",
              boxShadow: hovered ? `0 0 20px ${project.accentColor}40` : "0 4px 16px rgba(0,0,0,0.6)",
            }}
          >
            {/* Top Status & Category Row */}
            <div className="flex w-full items-center justify-between gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-neutral-300"
                style={{ backgroundColor: `${project.accentColor}20`, color: project.accentColor }}
              >
                {project.status}
              </span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.accentColor }} />
            </div>

            {/* Middle Project Title & Category */}
            <div className="my-2.5 flex flex-col items-center text-center">
              <h3 className="text-base font-bold tracking-tight text-white drop-shadow-sm">
                {project.title}
              </h3>
              <p className="mt-0.5 text-[11px] font-medium text-neutral-400">
                {project.category}
              </p>
            </div>

            {/* Bottom Inspect Action Cue */}
            <div className="mt-1 flex items-center gap-1 text-[10px] font-medium tracking-wide text-neutral-300 group-hover:text-white transition-colors">
              <span>Inspect Project</span>
              <span className="text-xs" style={{ color: project.accentColor }}>&rarr;</span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
