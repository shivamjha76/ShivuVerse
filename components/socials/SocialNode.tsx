"use client";

import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { SocialProfile } from "@/data/socials";

interface SocialNodeProps {
  profile: SocialProfile;
  worldPosition: [number, number, number];
  timingOffset?: number;
}

export default function SocialNode({
  profile,
  worldPosition,
  timingOffset = 0,
}: SocialNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const medallionRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const lastClickTimeRef = useRef<number>(0);

  const handleClick = (e?: any) => {
    e?.stopPropagation?.();
    const now = Date.now();
    if (now - lastClickTimeRef.current < 400) return;
    lastClickTimeRef.current = now;

    if (typeof window !== "undefined" && profile.url) {
      window.open(profile.url, "_blank", "noopener,noreferrer");
    }
  };

  // Subtle floating animation and hover scale lerping
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle vertical floating motion
    const floatY = Math.sin(time * 1.6 + timingOffset) * 0.08;
    groupRef.current.position.y = worldPosition[1] + floatY;

    // Gentle subtle tilt/rotation
    const swayZ = Math.sin(time * 0.9 + timingOffset) * 0.04;
    groupRef.current.rotation.z = swayZ;

    // Smooth hover scale interpolation
    const targetScale = hovered ? 1.14 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    );
  });

  // Vector SVG icon based on profile type
  const renderIconSvg = useMemo(() => {
    const className = "w-7 h-7 drop-shadow-sm transition-transform duration-300";

    switch (profile.icon) {
      case "github":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        );
      case "leetcode":
        return (
          <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.074 5.074 0 0 0-3.85-1.408c-1.362 0-2.689.544-3.693 1.547L3.974 10.74c-1.004 1.004-1.547 2.332-1.547 3.694s.543 2.69 1.547 3.694l4.332 4.363c1.004 1.004 2.331 1.547 3.693 1.547 1.362 0 2.69-.543 3.694-1.547l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.553-1.9-.038zM10.978 14.502h9.043c.732 0 1.325-.593 1.325-1.325s-.593-1.325-1.325-1.325h-9.043c-.732 0-1.325.593-1.325 1.325s.593 1.325 1.325 1.325z" />
          </svg>
        );
      case "instagram":
        return (
          <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        );
    }
  }, [profile.icon]);

  return (
    <group position={[worldPosition[0], 0, worldPosition[2]]}>
      {/* 1. Grounded Weathered Stone Pedestal */}
      <mesh position={[0, worldPosition[1] - 0.72, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.38, 0.46, 0.45, 8]} />
        <meshStandardMaterial
          color="#585249"
          roughness={0.92}
          metalness={0.03}
          flatShading
        />
      </mesh>

      {/* Subtle Rune Inscription on Pedestal Top */}
      <mesh
        position={[0, worldPosition[1] - 0.49, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <ringGeometry args={[0.22, 0.32, 16]} />
        <meshStandardMaterial
          color={profile.accentColor}
          emissive={profile.accentColor}
          emissiveIntensity={hovered ? 0.8 : 0.25}
          roughness={0.5}
        />
      </mesh>

      {/* 2. Floating 3D Interactive Medallion */}
      <group ref={groupRef} position={[0, worldPosition[1], 0]}>
        {/* Clickable 3D Medallion Mesh */}
        <mesh
          ref={medallionRef}
          rotation={[Math.PI / 2 + 0.1, 0, 0]}
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
          {/* Beveled Coin/Medallion Geometry oriented towards user */}
          <cylinderGeometry args={[0.42, 0.42, 0.08, 28]} />
          <meshStandardMaterial
            color="#2d2822"
            emissive={profile.accentColor}
            emissiveIntensity={hovered ? 0.38 : 0.08}
            roughness={0.45}
            metalness={0.55}
          />
        </mesh>

        {/* Outer Medallion Golden Rim Accent */}
        <mesh rotation={[0.1, 0, 0]}>
          <torusGeometry args={[0.42, 0.024, 12, 28]} />
          <meshStandardMaterial
            color={profile.accentColor}
            emissive={profile.accentColor}
            emissiveIntensity={hovered ? 0.7 : 0.2}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* 3. Embedded 3D Vector Icon & Tooltip Label */}
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
            className="pointer-events-auto flex flex-col items-center cursor-pointer group"
          >
            {/* Icon Disc */}
            <div
              className={`flex items-center justify-center rounded-full p-2.5 transition-all duration-300 ${
                hovered ? "scale-110" : "scale-100"
              }`}
              style={{
                color: profile.accentColor,
                filter: hovered
                  ? `drop-shadow(0 0 12px ${profile.accentColor}80)`
                  : "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              }}
            >
              {renderIconSvg}
            </div>

            {/* Hover Tooltip Label */}
            <div
              className={`absolute -top-12 flex flex-col items-center transition-all duration-300 ${
                hovered
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-black/80 px-3 py-1 shadow-lg backdrop-blur-md">
                <span className="text-xs font-semibold text-white">
                  {profile.name}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {profile.handle}
                </span>
                <span className="text-xs text-amber-400">&rarr;</span>
              </div>
              <div className="h-1.5 w-1.5 rotate-45 border-b border-r border-white/15 bg-black/80 -mt-1" />
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
