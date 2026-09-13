"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { gsap } from "gsap";
import {
  explorationStore,
  useExplorationStore,
  completeIntro,
  updateScrollProgress,
  setSceneLoaded,
} from "./explorationStore";
import { getPathX, getTerrainHeight } from "./terrainMath";

export default function CameraController() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { set } = useThree();

  const introPhase = useExplorationStore((s) => s.introPhase);
  const scrollProgress = useExplorationStore((s) => s.scrollProgress);

  // Vectors for smooth interpolation without garbage collection
  const currentCamPos = useMemo(() => new THREE.Vector3(0.0, 2.2, 19.5), []);
  const currentTarget = useMemo(() => new THREE.Vector3(0.4, 0.9, 12.0), []);
  const desiredCamPos = useMemo(() => new THREE.Vector3(0.0, 2.2, 19.5), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(0.4, 0.9, 12.0), []);
  const mouseOffset = useMemo(() => new THREE.Vector2(0, 0), []);
  const lookOffset = useMemo(() => new THREE.Vector2(0, 0), []);

  // Internal lerped scroll progress for smooth momentum
  const lerpedScroll = useRef(0);

  // Intro progress tracked by GSAP
  const introAnim = useRef({ progress: 0 });
  const introTween = useRef<gsap.core.Tween | null>(null);

  // Touch tracking for mobile
  const touchStartY = useRef<number | null>(null);
  const isTouchActive = useRef<boolean>(false);

  // Trigger scene loaded on initial mount
  useEffect(() => {
    setSceneLoaded();
  }, []);

  // Launch cinematic intro animation with GSAP
  useEffect(() => {
    if (introPhase === "playing") {
      introTween.current = gsap.to(introAnim.current, {
        progress: 1,
        duration: 6.5,
        ease: "power2.inOut",
        onComplete: () => {
          completeIntro();
        },
      });
    } else if (introPhase === "completed") {
      introAnim.current.progress = 1;
      if (introTween.current) {
        introTween.current.kill();
      }
    }

    return () => {
      if (introTween.current) introTween.current.kill();
    };
  }, [introPhase]);

  // Window scroll, touch & keyboard listeners with active modal guards
  useEffect(() => {
    const isModalActive = () => {
      const s = explorationStore.getState();
      return Boolean(
        s.selectedProjectId ||
          s.selectedSkillId ||
          s.selectedCertificateId ||
          s.isAboutOpen ||
          s.isContactOpen
      );
    };

    const handleWheel = (e: WheelEvent) => {
      if (isModalActive()) return;

      let deltaY = e.deltaY;
      if (e.deltaMode === 1) {
        deltaY *= 33.3; // normalize DOM_DELTA_LINE
      } else if (e.deltaMode === 2) {
        deltaY *= 600; // normalize DOM_DELTA_PAGE
      }

      const clampedDelta = Math.max(-120, Math.min(120, deltaY));
      updateScrollProgress(clampedDelta * 0.00055);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isModalActive()) return;
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
        isTouchActive.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isModalActive()) return;
      if (touchStartY.current !== null && e.touches.length > 0) {
        const currentY = e.touches[0].clientY;
        const delta = (touchStartY.current - currentY) * 0.0018;
        touchStartY.current = currentY;
        updateScrollProgress(delta);
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
      isTouchActive.current = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalActive()) return;

      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === "s" ||
        e.key === "S"
      ) {
        updateScrollProgress(0.035);
      } else if (
        e.key === "ArrowUp" ||
        e.key === "PageUp" ||
        e.key === "w" ||
        e.key === "W"
      ) {
        updateScrollProgress(-0.035);
      } else if (e.key === "Home") {
        updateScrollProgress(-1.0);
      } else if (e.key === "End") {
        updateScrollProgress(1.0);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Frame update: handles intro gliding, mouse parallax, and scroll exploration
  useFrame((state) => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    const time = state.clock.getElapsedTime();

    // Calculate initial entrance exploration coordinates
    const initBaseZ = 14.8;
    const initBaseX = getPathX(initBaseZ) + 0.18;
    const initGroundY = getTerrainHeight(initBaseX, initBaseZ);
    const initBaseY = initGroundY + 2.75;
    const initTargetZ = initBaseZ - 18.0;
    const initTargetX = getPathX(initTargetZ) + 1.15;
    const initTargetY = getTerrainHeight(initTargetX, initTargetZ) + 1.75;

    if (introPhase === "playing") {
      const p = introAnim.current.progress;

      const startX = 0.0;
      const startY = 2.2;
      const startZ = 19.5;
      const startTgtX = 0.4;
      const startTgtY = 0.9;
      const startTgtZ = 12.0;

      desiredCamPos.set(
        THREE.MathUtils.lerp(startX, initBaseX, p),
        THREE.MathUtils.lerp(startY, initBaseY, p),
        THREE.MathUtils.lerp(startZ, initBaseZ, p)
      );

      desiredTarget.set(
        THREE.MathUtils.lerp(startTgtX, initTargetX, p),
        THREE.MathUtils.lerp(startTgtY, initTargetY, p),
        THREE.MathUtils.lerp(startTgtZ, initTargetZ, p)
      );

      currentCamPos.copy(desiredCamPos);
      currentTarget.copy(desiredTarget);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentTarget);
    } else {
      // Exploration Mode
      // 1. Smoothly interpolate scroll progress for momentum
      lerpedScroll.current = THREE.MathUtils.lerp(
        lerpedScroll.current,
        scrollProgress,
        0.05
      );

      // 2. Full journey travel along the winding path from Entrance to Sunset Overlook
      // baseZ spans from 14.8 down to -42.0 (distance: 56.8 units)
      const baseZ = 14.8 - lerpedScroll.current * 56.8;
      const baseX = getPathX(baseZ) + 0.18;
      const groundY = getTerrainHeight(baseX, baseZ);
      const baseY = groundY + 2.75; // Consistent natural eye-level clearance

      // 3. Look forward down the path
      const targetZ = baseZ - 18.0;
      const targetX = getPathX(targetZ) + 1.0;
      const targetY = getTerrainHeight(targetX, targetZ) + 1.75;

      // 4. Smooth mouse parallax
      const { pointer } = state;
      const targetMouseX = isTouchActive.current ? 0 : pointer.x * 0.42;
      const targetMouseY = isTouchActive.current ? 0 : pointer.y * 0.25;
      const targetLookX = isTouchActive.current ? 0 : pointer.x * 2.0;
      const targetLookY = isTouchActive.current ? 0 : pointer.y * 1.15;

      mouseOffset.x = THREE.MathUtils.lerp(mouseOffset.x, targetMouseX, 0.05);
      mouseOffset.y = THREE.MathUtils.lerp(mouseOffset.y, targetMouseY, 0.05);
      lookOffset.x = THREE.MathUtils.lerp(lookOffset.x, targetLookX, 0.05);
      lookOffset.y = THREE.MathUtils.lerp(lookOffset.y, targetLookY, 0.05);

      // 5. Subtle natural breathing sway
      const idleSway = Math.sin(time * 0.45) * 0.045;

      desiredCamPos.set(
        baseX + mouseOffset.x,
        baseY + mouseOffset.y + idleSway,
        baseZ
      );

      desiredTarget.set(
        targetX + lookOffset.x,
        targetY + lookOffset.y,
        targetZ
      );

      currentCamPos.lerp(desiredCamPos, 0.08);
      currentTarget.lerp(desiredTarget, 0.08);

      camera.position.copy(currentCamPos);
      camera.lookAt(currentTarget);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0.0, 2.2, 19.5]}
      fov={46}
      near={0.1}
      far={200}
    />
  );
}
