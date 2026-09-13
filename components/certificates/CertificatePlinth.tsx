"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Certificate } from "@/data/certificates";
import { selectCertificate } from "../world/explorationStore";

interface CertificatePlinthProps {
  certificate: Certificate;
  worldPosition: [number, number, number];
  rotationY?: number;
  timingOffset?: number;
}

export default function CertificatePlinth({
  certificate,
  worldPosition,
  rotationY = 0,
  timingOffset = 0,
}: CertificatePlinthProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = (e: any) => {
    e?.stopPropagation?.();
    selectCertificate(certificate.id);
  };

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Subtle floating breathing motion
    const floatY = Math.sin(time * 1.5 + timingOffset) * 0.04;
    groupRef.current.position.y = worldPosition[1] + floatY;

    // Smooth hover scale interpolation
    const targetScale = hovered ? 1.06 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  return (
    <group position={[worldPosition[0], 0, worldPosition[2]]} rotation={[0, rotationY, 0]}>
      {/* 1. Grounded Weathered Stone Pedestal */}
      <mesh position={[0, worldPosition[1] - 0.58, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.42, 0.52, 0.75, 8]} />
        <meshStandardMaterial
          color="#524d45"
          roughness={0.9}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Stone Cap Shelf */}
      <mesh position={[0, worldPosition[1] - 0.18, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.55, 0.44, 0.1, 8]} />
        <meshStandardMaterial
          color="#635c52"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* 2. Floating Interactive Plaque Assembly */}
      <group ref={groupRef}>
        {/* Angled Stone / Bronze Tablet Frame */}
        <mesh
          position={[0, 0.22, 0]}
          rotation={[-0.2, 0, 0]}
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
          <boxGeometry args={[0.82, 0.58, 0.06]} />
          <meshStandardMaterial
            color="#2a241e"
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>

        {/* Emissive Tablet Face Core */}
        <mesh position={[0, 0.22, 0.035]} rotation={[-0.2, 0, 0]}>
          <planeGeometry args={[0.74, 0.5]} />
          <meshStandardMaterial
            color="#14181d"
            emissive={certificate.accentColor}
            emissiveIntensity={hovered ? 0.45 : 0.18}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Soft Point Light Glow */}
        <pointLight
          position={[0, 0.35, 0.25]}
          color={certificate.accentColor}
          intensity={hovered ? 1.2 : 0.65}
          distance={2.8}
          decay={2}
        />

        {/* Crisp HTML Overlay Tag */}
        <Html
          position={[0, 0.28, 0.08]}
          distanceFactor={9.5}
          center
          className="select-none pointer-events-auto"
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
            className="flex w-52 flex-col items-center justify-between rounded-xl border border-white/10 bg-neutral-950/90 p-3 shadow-xl backdrop-blur-md cursor-pointer transition-all duration-300"
            style={{
              borderColor: hovered ? `${certificate.accentColor}90` : "rgba(255,255,255,0.12)",
              boxShadow: hovered
                ? `0 0 24px ${certificate.accentColor}45`
                : "0 4px 16px rgba(0,0,0,0.6)",
            }}
          >
            {/* Category & Status Badge */}
            <div className="flex w-full items-center justify-between">
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${certificate.accentColor}20`,
                  color: certificate.accentColor,
                }}
              >
                {certificate.category}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {certificate.issueDate}
              </span>
            </div>

            {/* Title & Issuer */}
            <div className="my-2 flex flex-col items-center text-center">
              <h3 className="text-xs font-bold tracking-tight text-white line-clamp-1">
                {certificate.title}
              </h3>
              <p className="mt-0.5 text-[10px] font-medium text-neutral-400">
                {certificate.issuer}
              </p>
            </div>

            {/* Inspect Action */}
            <div className="mt-0.5 flex items-center gap-1 text-[9px] font-medium text-neutral-300">
              <span>View Credential</span>
              <span style={{ color: certificate.accentColor }}>&rarr;</span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
