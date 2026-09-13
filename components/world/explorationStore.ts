import { useSyncExternalStore } from "react";

export type IntroPhase = "loading" | "playing" | "completed";

export interface ExplorationState {
  isLoaded: boolean;
  introPhase: IntroPhase;
  scrollProgress: number; // 0.0 (path entrance) to 1.0 (deep path overlook)
  hasInteracted: boolean; // Set true when user scrolls or clicks
  selectedProjectId: string | null; // Currently inspected project modal
  selectedSkillId: string | null; // Currently inspected skill modal
}

type Listener = () => void;

let state: ExplorationState = {
  isLoaded: false,
  introPhase: "loading",
  scrollProgress: 0,
  hasInteracted: false,
  selectedProjectId: null,
  selectedSkillId: null,
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
    hasInteracted: true,
  }));
}

export function updateScrollProgress(delta: number) {
  explorationStore.setState((prev) => {
    const nextProgress = Math.max(0, Math.min(1, prev.scrollProgress + delta));
    return {
      scrollProgress: nextProgress,
      hasInteracted: true,
      introPhase: "completed",
    };
  });
}

export function scrollToProgress(targetProgress: number) {
  explorationStore.setState(() => ({
    scrollProgress: Math.max(0, Math.min(1, targetProgress)),
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
