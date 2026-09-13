"use client";

import React, { useEffect, useMemo } from "react";
import { PROJECTS } from "@/data/projects";
import { useExplorationStore, selectProject } from "../world/explorationStore";

export default function ProjectDetails() {
  const selectedProjectId = useExplorationStore((s) => s.selectedProjectId);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return PROJECTS.find((p) => p.id === selectedProjectId) || null;
  }, [selectedProjectId]);

  const currentIndex = PROJECTS.findIndex((p) => p.id === selectedProjectId);
  const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  const handleClose = () => {
    selectProject(null);
  };

  // Close on Escape key & Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProjectId) return;
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft" && prevProject) {
        selectProject(prevProject.id);
      } else if (e.key === "ArrowRight" && nextProject) {
        selectProject(nextProject.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProjectId, prevProject, nextProject]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (selectedProjectId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProjectId]);

  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      {/* Background click dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-700/60 bg-neutral-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 transform scale-100"
        style={{
          boxShadow: `0 0 35px ${selectedProject.accentColor}25`,
        }}
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: selectedProject.accentColor, color: selectedProject.accentColor }}
              />
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${selectedProject.accentColor}18`,
                  color: selectedProject.accentColor,
                }}
              >
                {selectedProject.status}
              </span>
            </div>

            <h2
              id="project-title"
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {selectedProject.title}
            </h2>
            <p className="text-xs font-medium text-neutral-400">
              {selectedProject.category}
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close project details"
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

        {/* Project Description */}
        <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
          {selectedProject.shortDescription}
        </div>

        {/* Tech Stack Pills */}
        {selectedProject.technologies.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Technologies &amp; Architecture
            </h4>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {selectedProject.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1 text-xs font-medium text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons & Prev/Next Navigation Row */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80 pt-5">
          {/* Previous / Next Project Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!prevProject}
              onClick={() => prevProject && selectProject(prevProject.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                prevProject
                  ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer"
                  : "border-neutral-800 text-neutral-600 cursor-not-allowed"
              }`}
            >
              &larr; Prev
            </button>
            <span className="text-[11px] text-neutral-500 font-mono">
              {currentIndex + 1} / {PROJECTS.length}
            </span>
            <button
              type="button"
              disabled={!nextProject}
              onClick={() => nextProject && selectProject(nextProject.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                nextProject
                  ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer"
                  : "border-neutral-800 text-neutral-600 cursor-not-allowed"
              }`}
            >
              Next &rarr;
            </button>
          </div>

          {/* External Links */}
          <div className="flex items-center gap-2.5">
            {selectedProject.github && (
              <a
                href={selectedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-700 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            )}

            {selectedProject.link ? (
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-neutral-950 shadow-md transition-all hover:brightness-110 cursor-pointer"
                style={{ backgroundColor: selectedProject.accentColor }}
              >
                <span>View Project</span>
                <span>&rarr;</span>
              </a>
            ) : (
              <span className="inline-flex items-center rounded-xl border border-neutral-800 bg-neutral-800/40 px-3 py-1.5 text-[11px] font-medium text-neutral-500">
                Preview In Progress
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
