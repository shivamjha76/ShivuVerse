"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import Environment from "./Environment";
import Mountains from "./Mountains";
import Terrain from "./Terrain";
import CameraController from "./CameraController";
import Pathway from "./Pathway";
import Stream from "./Stream";
import Waterfall from "./Waterfall";
import Trees from "./Tree";
import Bushes from "./Bushes";
import Rocks from "./Rocks";
import Flowers from "./Flowers";
import Grass from "./Grass";
import Clouds from "./Clouds";
import AmbientAtmosphere from "./AmbientAtmosphere";
import SocialGarden from "../socials/SocialGarden";
import ProjectWorkshop from "../projects/ProjectWorkshop";
import KnowledgeTree from "../skills/KnowledgeTree";
import CertificateGrove from "../certificates/CertificateGrove";
import AboutArea from "../about/AboutArea";
import ContactArea from "../contact/ContactArea";
import { useExplorationStore } from "./explorationStore";

interface WorldProps {
  className?: string;
}

export default function World({ className = "w-full h-full" }: WorldProps) {
  const quality = useExplorationStore((s) => s.quality);

  const dpr = quality === "low" ? 1 : quality === "medium" ? [1, 1.5] : [1, 2];
  const enableShadows = quality !== "low";

  return (
    <div className={`relative overflow-hidden bg-[#0c0d0e] ${className}`}>
      <Canvas
        shadows={enableShadows}
        dpr={dpr as any}
        gl={{
          antialias: quality !== "low",
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <Environment />
          <Clouds />
          <Mountains />
          <Terrain />
          <Pathway />
          <Stream />
          <Waterfall />
          <SocialGarden />
          <ProjectWorkshop />
          <KnowledgeTree />
          <CertificateGrove />
          <AboutArea />
          <ContactArea />
          <Trees />
          <Bushes />
          <Rocks />
          <Flowers />
          <Grass />
          <AmbientAtmosphere />
        </Suspense>
      </Canvas>
    </div>
  );
}
