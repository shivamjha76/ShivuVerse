"use client";

import React, { useEffect, useState } from "react";
import {
  useExplorationStore,
  skipIntro,
  scrollToProgress,
} from "../world/explorationStore";

export default function IntroOverlay() {
  const isLoaded = useExplorationStore((s) => s.isLoaded);
  const introPhase = useExplorationStore((s) => s.introPhase);
  const hasInteracted = useExplorationStore((s) => s.hasInteracted);
  const scrollProgress = useExplorationStore((s) => s.scrollProgress);

  // Sub-stages for the intro text entrance & exit
  const [showMainTitle, setShowMainTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOutIntroText, setFadeOutIntroText] = useState(false);

  useEffect(() => {
    if (introPhase === "playing") {
      // Staggered cinematic text entrance
      const timer1 = setTimeout(() => setShowMainTitle(true), 350);
      const timer2 = setTimeout(() => setShowSubtitle(true), 1100);
      // Begin fading out text as camera approaches the exploration landing
      const timer3 = setTimeout(() => setFadeOutIntroText(true), 3800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else if (introPhase === "completed") {
      setShowMainTitle(false);
      setShowSubtitle(false);
      setFadeOutIntroText(true);
    }
  }, [introPhase]);

  const landmarks = [
    { label: "Entrance", progress: 0.0 },
    { label: "Socials", progress: 0.65 },
    { label: "Projects", progress: 0.92 },
    { label: "Waterfall", progress: 1.0 },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-8 select-none">
      {/* 1. Minimal Initial Loading Screen */}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0c] transition-opacity duration-500 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-light tracking-[0.3em] uppercase text-white drop-shadow-md sm:text-3xl font-sans">
            ShivuVerse
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80 animate-ping" />
            <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
              Initializing World
            </span>
          </div>
        </div>
      </div>

      {/* Top Header Row: Subtle branding, Quick Nav & Skip button */}
      <header className="flex w-full items-center justify-between gap-4">
        {/* Subtle Watermark Branding */}
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            ShivuVerse
          </span>
        </div>

        {/* Quick Landmark Navigation Pills (Visible once intro is completed) */}
        {introPhase === "completed" && (
          <nav aria-label="Landmarks" className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-neutral-950/70 p-1 backdrop-blur-md shadow-lg transition-all">
            {landmarks.map((landmark) => {
              const isActive = Math.abs(scrollProgress - landmark.progress) < 0.14;
              return (
                <button
                  key={landmark.label}
                  type="button"
                  onClick={() => scrollToProgress(landmark.progress)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? "bg-amber-400/20 text-amber-300 shadow-sm border border-amber-400/40"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {landmark.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Skip Intro Button (Visible only during intro animation) */}
        {introPhase === "playing" && (
          <button
            type="button"
            onClick={skipIntro}
            className="pointer-events-auto cursor-pointer rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-xs font-medium tracking-wider text-neutral-300 backdrop-blur-md transition-all hover:border-amber-400/40 hover:bg-black/60 hover:text-white"
          >
            Skip intro &rarr;
          </button>
        )}
      </header>

      {/* 2. Cinematic Intro Text (Overlaid over the sweeping camera view) */}
      <div className="my-auto flex flex-col items-center text-center px-4">
        {introPhase === "playing" && (
          <div
            className={`transition-all duration-1000 transform ${
              fadeOutIntroText
                ? "opacity-0 -translate-y-4"
                : "opacity-100 translate-y-0"
            }`}
          >
            {/* Main Title */}
            <h2
              className={`text-3xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-5xl lg:text-6xl transition-all duration-1000 ${
                showMainTitle
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                ShivuVerse
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className={`mt-3 max-w-xl text-sm font-medium tracking-wide text-neutral-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-base lg:text-lg transition-all duration-1000 delay-150 ${
                showSubtitle
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              I&apos;m Shivu &mdash; a Computer Science Student &amp; Developer.
            </p>
          </div>
        )}
      </div>

      {/* 3. Subtle Exploration Prompt (Appears near bottom after intro) */}
      <footer className="flex w-full flex-col items-center justify-center pb-4">
        <div
          className={`flex flex-col items-center gap-2.5 transition-all duration-700 ${
            introPhase === "completed" && !hasInteracted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-neutral-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            Explore my world
          </span>

          {/* Minimal Animated Mouse/Scroll Indicator */}
          <div className="flex flex-col items-center gap-1">
            <div className="relative flex h-8 w-5 items-start justify-center rounded-full border border-neutral-300/60 bg-black/30 p-1 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <span className="h-2 w-1 rounded-full bg-amber-400 animate-bounce" />
            </div>
            <span className="text-[10px] tracking-widest uppercase text-neutral-300/80 font-mono">
              Scroll to explore
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
