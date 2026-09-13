"use client";

import React, { useEffect, useState } from "react";
import {
  useExplorationStore,
  skipIntro,
  scrollToProgress,
  setQuality,
  QualityLevel,
} from "../world/explorationStore";

export default function IntroOverlay() {
  const isLoaded = useExplorationStore((s) => s.isLoaded);
  const introPhase = useExplorationStore((s) => s.introPhase);
  const hasInteracted = useExplorationStore((s) => s.hasInteracted);
  const scrollProgress = useExplorationStore((s) => s.scrollProgress);
  const currentArea = useExplorationStore((s) => s.currentArea);
  const quality = useExplorationStore((s) => s.quality);

  // Staged cinematic text progression
  const [stage, setStage] = useState<"black" | "glide" | "welcome" | "prompt" | "done">("black");
  const [showNavMenu, setShowNavMenu] = useState(false);

  useEffect(() => {
    if (introPhase === "playing") {
      setStage("black");
      const t1 = setTimeout(() => setStage("glide"), 900);
      const t2 = setTimeout(() => setStage("welcome"), 1800);
      const t3 = setTimeout(() => setStage("prompt"), 4200);
      const t4 = setTimeout(() => setStage("done"), 6400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else if (introPhase === "completed") {
      setStage("done");
    }
  }, [introPhase]);

  const landmarks = [
    { label: "Main Garden", progress: 0.0 },
    { label: "Socials", progress: 0.25 },
    { label: "Workshop", progress: 0.44 },
    { label: "Knowledge", progress: 0.64 },
    { label: "Certificates", progress: 0.77 },
    { label: "About", progress: 0.88 },
    { label: "Overlook", progress: 1.0 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* 1. Minimal Initial Loading Screen */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0c] transition-opacity duration-700 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-light tracking-[0.35em] uppercase text-white drop-shadow-md sm:text-3xl font-sans">
            ShivuVerse
          </h1>
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono tracking-widest text-neutral-400">
              Entering ShivuVerse...
            </span>
          </div>
        </div>
      </div>

      {/* 0-2s Cinematic Blackout Fade */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0c] pointer-events-none transition-opacity duration-1000 ${
          introPhase === "playing" && stage === "black"
            ? "opacity-100"
            : "opacity-0"
        }`}
      />

      {/* Top Header Row: Branding, Subtle Quality Toggle, Skip Button */}
      <header className="flex w-full items-center justify-between gap-4">
        {/* Subtle Watermark Branding */}
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            ShivuVerse
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Subtle Quality Selector (Desktop & Mobile) */}
          <div className="pointer-events-auto flex items-center rounded-full border border-white/10 bg-neutral-950/70 p-0.5 backdrop-blur-md shadow-md">
            {(["low", "medium", "high"] as QualityLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setQuality(lvl)}
                className={`rounded-full px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  quality === lvl
                    ? "bg-amber-400/20 text-amber-300 shadow-sm border border-amber-400/30"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {lvl === "low" ? "Low" : lvl === "medium" ? "Med" : "High"}
              </button>
            ))}
          </div>

          {/* Skip Intro Button */}
          {introPhase === "playing" && (
            <button
              type="button"
              onClick={skipIntro}
              className="pointer-events-auto cursor-pointer rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-xs font-medium tracking-wider text-neutral-300 backdrop-blur-md transition-all hover:border-amber-400/40 hover:bg-black/60 hover:text-white"
            >
              Skip intro &rarr;
            </button>
          )}
        </div>
      </header>

      {/* 2. Cinematic Intro Sequence Text Overlay */}
      <div className="my-auto flex flex-col items-center text-center px-4">
        {introPhase === "playing" && (
          <div className="max-w-xl transition-all duration-700">
            {stage === "welcome" && (
              <div className="animate-in fade-in duration-700">
                <h2 className="text-2xl font-light tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-4xl">
                  Welcome to my world.
                </h2>
                <p className="mt-2 text-sm font-medium tracking-wide text-amber-300/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-lg">
                  I&apos;m Shivu &mdash; a Computer Science Student &amp; Developer
                </p>
              </div>
            )}

            {stage === "prompt" && (
              <div className="animate-in fade-in duration-700">
                <h3 className="text-xl font-light tracking-widest text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-3xl font-serif italic">
                  Explore my journey.
                </h3>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Row: Subtle Location Helper & Exploration Prompt */}
      <footer className="flex w-full items-end justify-between gap-4">
        {/* Subtle Location Helper / Compass Indicator in Bottom-Left */}
        <div className="pointer-events-auto relative">
          <button
            type="button"
            onClick={() => setShowNavMenu((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/80 px-3.5 py-1.5 backdrop-blur-md shadow-lg transition-all hover:border-amber-400/40 cursor-pointer"
          >
            {/* Minimal Compass Beacon */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>

            <span className="text-[11px] font-medium tracking-wider text-neutral-300">
              Exploring &middot;{" "}
              <span className="text-amber-300 font-semibold">{currentArea}</span>
            </span>
          </button>

          {/* Quick Jump Landmark Dropdown Menu */}
          {showNavMenu && (
            <div className="absolute bottom-10 left-0 flex w-48 flex-col gap-1 rounded-2xl border border-neutral-700/60 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-xl">
              <span className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-neutral-400">
                Jump to Landmark
              </span>
              {landmarks.map((landmark) => (
                <button
                  key={landmark.label}
                  type="button"
                  onClick={() => {
                    scrollToProgress(landmark.progress);
                    setShowNavMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                    currentArea.toLowerCase().includes(landmark.label.toLowerCase())
                      ? "bg-amber-400/20 text-amber-300 font-semibold"
                      : "text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  <span>{landmark.label}</span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {Math.round(landmark.progress * 100)}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exploration Scroll Cue (Fades once user begins interacting) */}
        <div
          className={`flex flex-col items-center gap-2 transition-all duration-700 ${
            introPhase === "completed" && !hasInteracted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex h-7 w-4 items-start justify-center rounded-full border border-neutral-300/60 bg-black/30 p-1 backdrop-blur-sm shadow-md">
              <span className="h-1.5 w-1 rounded-full bg-amber-400 animate-bounce" />
            </div>
            <span className="text-[9px] tracking-widest uppercase text-neutral-300/80 font-mono">
              Scroll to explore
            </span>
          </div>
        </div>

        {/* Empty right anchor to balance flex spacing */}
        <div className="w-24 hidden sm:block" />
      </footer>
    </div>
  );
}
