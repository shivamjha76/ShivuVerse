"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Environment from "./Environment";
import Terrain from "./Terrain";
import CameraController from "./CameraController";
import Pathway from "./Pathway";
import Stream from "./Stream";
import Waterfall from "./Waterfall";
import Trees from "./Tree";
import Rocks from "./Rocks";
import Flowers from "./Flowers";
import Grass from "./Grass";
import SocialGarden from "../socials/SocialGarden";
import ProjectWorkshop from "../projects/ProjectWorkshop";
import KnowledgeTree from "../skills/KnowledgeTree";

interface WorldProps {
  className?: string;
}

export default function World({ className = "w-full h-full" }: WorldProps) {
  return (
    <div className={`relative overflow-hidden bg-[#0c0d0e] ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <Environment />
          <Terrain />
          <Pathway />
          <Stream />
          <Waterfall />
          <SocialGarden />
          <ProjectWorkshop />
          <KnowledgeTree />
          <Trees />
          <Rocks />
          <Flowers />
          <Grass />
        </Suspense>
      </Canvas>
    </div>
  );
}
