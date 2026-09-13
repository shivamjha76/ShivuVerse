"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export default function Mountains() {
  const mountainGeometries = useMemo(() => {
    // 1. Far Northern Mountain Range (majestic peaks along the distant horizon)
    const farCols = 48;
    const farRows = 16;
    const farWidth = 260;
    const farDepth = 90;
    const farGeom = new THREE.PlaneGeometry(farWidth, farDepth, farCols, farRows);
    farGeom.rotateX(-Math.PI / 2);

    const farPos = farGeom.attributes.position;
    const farCount = farPos.count;
    const farColors = new Float32Array(farCount * 3);

    const baseValleyColor = new THREE.Color("#374744"); // Deep alpine slate-green
    const midRidgeColor = new THREE.Color("#4d5c68");   // Atmospheric granite slate
    const peakColor = new THREE.Color("#708499");       // Distant hazy blue peak
    const hazeColor = new THREE.Color("#c7b99c");       // Golden-hour atmospheric dust
    const tempColor = new THREE.Color();

    for (let i = 0; i < farCount; i++) {
      const x = farPos.getX(i);
      const z = farPos.getZ(i);

      // Multi-frequency peak ridges
      const nx = x * 0.035;
      const nz = z * 0.045;
      const mainPeak =
        Math.abs(Math.sin(nx * 1.4) * Math.cos(nz * 1.2)) * 32.0 +
        Math.abs(Math.sin(nx * 2.8 + 1.2) * Math.cos(nz * 2.1)) * 14.0 +
        Math.sin(nx * 5.5) * 4.5;

      // Saddle drop in the middle to create a dramatic valley vista
      const centerFactor = Math.min(Math.abs(x) / 55.0, 1.0);
      const elevation = (mainPeak * 0.5 + mainPeak * centerFactor * 0.7) + 6.0;

      farPos.setY(i, elevation);

      // Height and distance based atmospheric coloration
      const normH = Math.min(Math.max(elevation / 42.0, 0), 1);
      tempColor.copy(baseValleyColor).lerp(midRidgeColor, normH * 0.7);
      if (normH > 0.5) {
        tempColor.lerp(peakColor, (normH - 0.5) / 0.5);
      }
      // Blend distance haze near the bottom base
      if (normH < 0.25) {
        tempColor.lerp(hazeColor, (0.25 - normH) * 1.2);
      }

      farColors[i * 3] = tempColor.r;
      farColors[i * 3 + 1] = tempColor.g;
      farColors[i * 3 + 2] = tempColor.b;
    }

    farGeom.setAttribute("color", new THREE.BufferAttribute(farColors, 3));
    farGeom.computeVertexNormals();

    // 2. Western Flank Mountains (framing the left horizon)
    const westGeom = new THREE.PlaneGeometry(160, 70, 28, 12);
    westGeom.rotateX(-Math.PI / 2);
    westGeom.rotateY(Math.PI * 0.35);

    const westPos = westGeom.attributes.position;
    const westCount = westPos.count;
    const westColors = new Float32Array(westCount * 3);

    for (let i = 0; i < westCount; i++) {
      const x = westPos.getX(i);
      const z = westPos.getZ(i);
      const elev =
        Math.abs(Math.sin(x * 0.04) * Math.cos(z * 0.05)) * 24.0 +
        Math.abs(Math.sin(x * 0.08 + 0.8)) * 8.0 + 4.0;

      westPos.setY(i, elev);

      const normH = Math.min(Math.max(elev / 30.0, 0), 1);
      tempColor.copy(baseValleyColor).lerp(midRidgeColor, normH);
      westColors[i * 3] = tempColor.r;
      westColors[i * 3 + 1] = tempColor.g;
      westColors[i * 3 + 2] = tempColor.b;
    }
    westGeom.setAttribute("color", new THREE.BufferAttribute(westColors, 3));
    westGeom.computeVertexNormals();

    // 3. Eastern Flank Mountains (framing the right horizon behind waterfall)
    const eastGeom = new THREE.PlaneGeometry(170, 70, 28, 12);
    eastGeom.rotateX(-Math.PI / 2);
    eastGeom.rotateY(-Math.PI * 0.35);

    const eastPos = eastGeom.attributes.position;
    const eastCount = eastPos.count;
    const eastColors = new Float32Array(eastCount * 3);

    for (let i = 0; i < eastCount; i++) {
      const x = eastPos.getX(i);
      const z = eastPos.getZ(i);
      const elev =
        Math.abs(Math.sin(x * 0.045) * Math.cos(z * 0.045)) * 26.0 +
        Math.abs(Math.cos(z * 0.09 + 0.5)) * 9.0 + 5.0;

      eastPos.setY(i, elev);

      const normH = Math.min(Math.max(elev / 32.0, 0), 1);
      tempColor.copy(baseValleyColor).lerp(midRidgeColor, normH);
      eastColors[i * 3] = tempColor.r;
      eastColors[i * 3 + 1] = tempColor.g;
      eastColors[i * 3 + 2] = tempColor.b;
    }
    eastGeom.setAttribute("color", new THREE.BufferAttribute(eastColors, 3));
    eastGeom.computeVertexNormals();

    return { farGeom, westGeom, eastGeom };
  }, []);

  return (
    <group>
      {/* Distant Northern Horizon Peaks */}
      <mesh
        geometry={mountainGeometries.farGeom}
        position={[0, -2.0, -115]}
        receiveShadow={false}
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.92}
          metalness={0.04}
          flatShading={false}
        />
      </mesh>

      {/* Western Valley Framing Ridge */}
      <mesh
        geometry={mountainGeometries.westGeom}
        position={[-85, -2.0, -45]}
        receiveShadow={false}
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.92}
          metalness={0.04}
          flatShading={false}
        />
      </mesh>

      {/* Eastern Valley Framing Ridge behind Waterfall */}
      <mesh
        geometry={mountainGeometries.eastGeom}
        position={[88, -2.0, -50]}
        receiveShadow={false}
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.92}
          metalness={0.04}
          flatShading={false}
        />
      </mesh>
    </group>
  );
}
