"use client";

import React, { useState } from "react";
import { CONTACT_DATA } from "@/data/contact";
import { setAboutOpen } from "../world/explorationStore";

export default function ContactCard() {
  const [copied, setCopied] = useState(false);

  const handleActionClick = async (action: (typeof CONTACT_DATA.actions)[0]) => {
    if (action.id === "email") {
      try {
        await navigator.clipboard.writeText(action.displayValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {
        window.location.href = action.value;
      }
    } else if (action.isExternal) {
      window.open(action.value, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = action.value;
    }
  };

  return (
    <div className="flex w-80 max-w-[90vw] flex-col rounded-2xl border border-white/10 bg-neutral-950/92 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 select-none">
      {/* Top Heading */}
      <div className="flex flex-col items-center text-center">
        <span className="rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-300">
          Get in Touch
        </span>
        <h3 className="mt-2 text-lg font-bold tracking-tight text-white sm:text-xl">
          {CONTACT_DATA.heading}
        </h3>
        <p className="mt-1 text-[11px] leading-relaxed text-neutral-400">
          {CONTACT_DATA.subtext}
        </p>
      </div>

      {/* Direct Contact Actions */}
      <div className="mt-4 flex flex-col gap-2">
        {CONTACT_DATA.actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={() => handleActionClick(act)}
            className="group flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/80 px-3.5 py-2.5 text-left transition-all hover:border-neutral-600 hover:bg-neutral-800/80 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                style={{
                  backgroundColor: `${act.accentColor}20`,
                  color: act.accentColor,
                }}
              >
                {act.id === "email" ? "@" : act.id === "linkedin" ? "in" : "<>"}
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                  {act.label}
                </span>
                <span className="text-[10px] font-mono">
                  {act.id === "email" && copied ? (
                    <span className="text-emerald-400 font-medium">Copied to clipboard! ✓</span>
                  ) : (
                    <span className="text-neutral-400">{act.displayValue}</span>
                  )}
                </span>
              </div>
            </div>

            <span
              className="text-xs font-medium text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform"
              style={{ color: act.id === "email" && copied ? "#34d399" : act.accentColor }}
            >
              {act.id === "email" ? (copied ? "✓" : "Copy") : "↗"}
            </span>
          </button>
        ))}
      </div>

      {/* Quick About Link */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-800/80 pt-3">
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          className="text-[11px] font-medium text-amber-300 hover:underline cursor-pointer"
        >
          &larr; Read About Shivu
        </button>

        <span className="text-[10px] text-neutral-500 font-mono">
          ShivuVerse &copy; {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}
