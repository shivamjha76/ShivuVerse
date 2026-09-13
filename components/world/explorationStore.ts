import { useSyncExternalStore } from "react";

export type IntroPhase = "loading" | "playing" | "completed";
export type QualityLevel = "high" | "medium" | "low";
export type WorldArea =
  | "Main Garden"
  | "Social Garden"
  | "Project Workshop"
  | "Knowledge Tree"
  | "Certificate Grove"
  | "About Me"
  | "Final Contact";

export interface ExplorationState {
  isLoaded: boolean;
  introPhase: IntroPhase;
  scrollProgress: number; // 0.0 (path entrance) to 1.0 (deep path overlook)
  hasInteracted: boolean; // Set true when user scrolls or clicks
  selectedProjectId: string | null; // Currently inspected project modal
  selectedSkillId: string | null; // Currently inspected skill modal
  selectedCertificateId: string | null; // Currently inspected certificate modal
  isAboutOpen: boolean; // About Me modal overlay
  isContactOpen: boolean; // Final Contact modal overlay
  quality: QualityLevel;
  currentArea: WorldArea;
}

type Listener = () => void;

export function getAreaFromProgress(progress: number): WorldArea {
  if (progress < 0.16) return "Main Garden";
  if (progress < 0.35) return "Social Garden";
  if (progress < 0.54) return "Project Workshop";
  if (progress < 0.70) return "Knowledge Tree";
  if (progress < 0.83) return "Certificate Grove";
  if (progress < 0.94) return "About Me";
  return "Final Contact";
}

let state: ExplorationState = {
  isLoaded: false,
  introPhase: "loading",
  scrollProgress: 0,
  hasInteracted: false,
  selectedProjectId: null,
  selectedSkillId: null,
  selectedCertificateId: null,
  isAboutOpen: false,
  isContactOpen: false,
  quality: "high",
  currentArea: "Main Garden",
};

const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

export const explorationStore = {
  getState: (): ExplorationState => state,
  setState: (updater: (prev: ExplorationState) => Partial<ExplorationState>) => {
    state = { ...state, ...updater(state) };
    emitChange();
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useExplorationStore<T>(selector: (s: ExplorationState) => T): T {
  return useSyncExternalStore(
    explorationStore.subscribe,
    () => selector(explorationStore.getState()),
    () => selector(explorationStore.getState())
  );
}

export function setSceneLoaded() {
  explorationStore.setState((prev) => {
    if (prev.isLoaded) return {};
    return {
      isLoaded: true,
      introPhase: "playing",
    };
  });
}

export function completeIntro() {
  explorationStore.setState(() => ({
    introPhase: "completed",
  }));
}

export function skipIntro() {
  explorationStore.setState(() => ({
    introPhase: "completed",
    hasInteracted: false,
  }));
}

export function updateScrollProgress(delta: number) {
  explorationStore.setState((prev) => {
    const nextProgress = Math.max(0, Math.min(1, prev.scrollProgress + delta));
    return {
      scrollProgress: nextProgress,
      currentArea: getAreaFromProgress(nextProgress),
      hasInteracted: true,
      introPhase: "completed",
    };
  });
}

export function scrollToProgress(targetProgress: number) {
  const nextProgress = Math.max(0, Math.min(1, targetProgress));
  explorationStore.setState(() => ({
    scrollProgress: nextProgress,
    currentArea: getAreaFromProgress(nextProgress),
    hasInteracted: true,
    introPhase: "completed",
  }));
}

export function selectProject(id: string | null) {
  explorationStore.setState(() => ({
    selectedProjectId: id,
    hasInteracted: true,
  }));
}

export function selectSkill(id: string | null) {
  explorationStore.setState(() => ({
    selectedSkillId: id,
    hasInteracted: true,
  }));
}

export function selectCertificate(id: string | null) {
  explorationStore.setState(() => ({
    selectedCertificateId: id,
    hasInteracted: true,
  }));
}

export function setAboutOpen(open: boolean) {
  explorationStore.setState(() => ({
    isAboutOpen: open,
    hasInteracted: true,
  }));
}

export function setContactOpen(open: boolean) {
  explorationStore.setState(() => ({
    isContactOpen: open,
    hasInteracted: true,
  }));
}

export function setQuality(quality: QualityLevel) {
  explorationStore.setState(() => ({
    quality,
  }));
}
