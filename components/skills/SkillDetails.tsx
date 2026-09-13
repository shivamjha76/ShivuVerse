"use client";

import React, { useEffect, useMemo } from "react";
import { SKILLS } from "@/data/skills";
import { useExplorationStore, selectSkill } from "../world/explorationStore";

export default function SkillDetails() {
  const selectedSkillId = useExplorationStore((s) => s.selectedSkillId);

  const selectedSkill = useMemo(() => {
    if (!selectedSkillId) return null;
    return SKILLS.find((s) => s.id === selectedSkillId) || null;
  }, [selectedSkillId]);

  const handleClose = () => {
    selectSkill(null);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedSkillId) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSkillId]);

  if (!selectedSkill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      {/* Backdrop click dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-neutral-700/60 bg-neutral-900/95 p-6 sm:p-7 shadow-2xl backdrop-blur-xl transition-all duration-300 transform scale-100"
        style={{
          boxShadow: `0 0 32px ${selectedSkill.accentColor}25`,
        }}
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: selectedSkill.accentColor, color: selectedSkill.accentColor }}
              />
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${selectedSkill.accentColor}18`,
                  color: selectedSkill.accentColor,
                }}
              >
                {selectedSkill.category}
              </span>
            </div>

            <h2
              id="skill-title"
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {selectedSkill.name}
            </h2>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close skill details"
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

        {/* Skill Knowledge & Description */}
        <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-neutral-300 text-sm leading-relaxed">
          {selectedSkill.description}
        </div>

        {/* Knowledge Tree Context Note */}
        <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
          <span className="text-amber-400">&bull;</span>
          <span>Knowledge branch: <span className="text-neutral-200 capitalize font-medium">{selectedSkill.branch.replace("-", " ")}</span></span>
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
