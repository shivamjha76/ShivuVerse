"use client";

import React, { useEffect } from "react";
import { ABOUT_DATA } from "@/data/about";
import { useExplorationStore, setAboutOpen } from "../world/explorationStore";

export default function AboutDetails() {
  const isAboutOpen = useExplorationStore((s) => s.isAboutOpen);

  const handleClose = () => {
    setAboutOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAboutOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAboutOpen]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isAboutOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAboutOpen]);

  if (!isAboutOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      {/* Backdrop dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-700/60 bg-neutral-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300"
        style={{
          boxShadow: "0 0 36px rgba(251, 191, 36, 0.2)",
        }}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                Personal Sanctuary
              </span>
            </div>

            <h2
              id="about-title"
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {ABOUT_DATA.name}
            </h2>
            <p className="text-xs font-medium text-neutral-400">
              {ABOUT_DATA.role}
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close about details"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800/80 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-700 hover:text-white transition-all cursor-pointer"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Short Bio */}
        <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-neutral-300 text-sm leading-relaxed">
          {ABOUT_DATA.shortBio}
        </div>

        {/* Philosophy Block */}
        <div className="mt-4 rounded-xl border border-amber-950/40 bg-amber-950/20 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Development Philosophy
          </span>
          <p className="mt-1 text-xs italic text-amber-200/90 leading-relaxed">
            &ldquo;{ABOUT_DATA.philosophy}&rdquo;
          </p>
        </div>

        {/* Core Focus Areas */}
        <div className="mt-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Core Technical Focus
          </span>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ABOUT_DATA.focusAreas.map((area, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-2.5 text-xs font-medium text-neutral-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Row */}
        <div className="mt-6 flex items-center justify-end border-t border-neutral-800/80 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-neutral-700 bg-neutral-800/60 px-5 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
