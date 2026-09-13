"use client";

import React, { useEffect, useMemo } from "react";
import { CERTIFICATES } from "@/data/certificates";
import {
  useExplorationStore,
  selectCertificate,
} from "../world/explorationStore";

export default function CertificateDetails() {
  const selectedCertificateId = useExplorationStore(
    (s) => s.selectedCertificateId
  );

  const cert = useMemo(() => {
    if (!selectedCertificateId) return null;
    return CERTIFICATES.find((c) => c.id === selectedCertificateId) || null;
  }, [selectedCertificateId]);

  const currentIndex = CERTIFICATES.findIndex((c) => c.id === selectedCertificateId);
  const prevCert = currentIndex > 0 ? CERTIFICATES[currentIndex - 1] : null;
  const nextCert = currentIndex < CERTIFICATES.length - 1 ? CERTIFICATES[currentIndex + 1] : null;

  const handleClose = () => {
    selectCertificate(null);
  };

  // Close on Escape key & Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCertificateId) return;
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft" && prevCert) {
        selectCertificate(prevCert.id);
      } else if (e.key === "ArrowRight" && nextCert) {
        selectCertificate(nextCert.id);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCertificateId, prevCert, nextCert]);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (selectedCertificateId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCertificateId]);

  if (!cert) return null;

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
        aria-labelledby="cert-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-700/60 bg-neutral-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300"
        style={{
          boxShadow: `0 0 36px ${cert.accentColor}25`,
        }}
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: cert.accentColor, color: cert.accentColor }}
              />
              <span
                className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: `${cert.accentColor}18`,
                  color: cert.accentColor,
                }}
              >
                {cert.category} Certification
              </span>
              <span className="text-xs text-neutral-400">&bull; {cert.issueDate}</span>
            </div>

            <h2
              id="cert-title"
              className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {cert.title}
            </h2>
            <p className="text-xs font-medium text-neutral-400">
              Issued by <span className="text-neutral-200">{cert.issuer}</span>
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close certificate details"
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

        {/* Certificate Description */}
        <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-neutral-300 text-sm leading-relaxed">
          {cert.description}
        </div>

        {/* Skills Covered */}
        <div className="mt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Competencies & Skills
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cert.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-neutral-800 bg-neutral-950/50 px-2.5 py-1 text-xs font-medium text-neutral-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Credential ID & Action Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800/80 pt-4">
          {/* Previous / Next Certificate Switcher */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!prevCert}
              onClick={() => prevCert && selectCertificate(prevCert.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                prevCert
                  ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer"
                  : "border-neutral-800 text-neutral-600 cursor-not-allowed"
              }`}
            >
              &larr; Prev
            </button>
            <span className="text-[11px] text-neutral-500 font-mono">
              {currentIndex + 1} / {CERTIFICATES.length}
            </span>
            <button
              type="button"
              disabled={!nextCert}
              onClick={() => nextCert && selectCertificate(nextCert.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                nextCert
                  ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer"
                  : "border-neutral-800 text-neutral-600 cursor-not-allowed"
              }`}
            >
              Next &rarr;
            </button>
          </div>

          <div className="flex items-center gap-2">
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-medium text-neutral-200 hover:border-amber-400/40 hover:bg-neutral-700 hover:text-white transition-all cursor-pointer"
              >
                <span>Verify Credential</span>
                <span className="text-xs">&nearr;</span>
              </a>
            )}
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
    </div>
  );
}
