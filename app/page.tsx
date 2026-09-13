"use client";

import dynamic from "next/dynamic";
import IntroOverlay from "@/components/ui/IntroOverlay";
import ProjectDetails from "@/components/projects/ProjectDetails";
import SkillDetails from "@/components/skills/SkillDetails";

// Dynamically import World to ensure clean client-side WebGL mounting
const World = dynamic(() => import("@/components/world/World"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a0a0c]">
      <World className="h-screen w-full" />
      <IntroOverlay />
      <ProjectDetails />
      <SkillDetails />
    </main>
  );
}
