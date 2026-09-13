/**
 * ShivuVerse Social Profiles Data Source
 * Centralized configuration for all interactive 3D social landmarks in the Social Garden.
 * Update URLs and handles here to update the entire 3D world.
 */

export interface SocialProfile {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: "github" | "linkedin" | "leetcode" | "instagram";
  accentColor: string;
  description: string;
  // Local offset [x, z] relative to the garden center
  offset: [number, number];
}

export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    id: "github",
    name: "GitHub",
    handle: "@shivu",
    url: "https://github.com/shivu-dev", // Replace with your actual GitHub URL
    icon: "github",
    accentColor: "#e6c387",
    description: "Repositories & Open Source",
    offset: [-1.8, 1.1],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "in/shivu",
    url: "https://linkedin.com/in/shivu-cs", // Replace with your actual LinkedIn URL
    icon: "linkedin",
    accentColor: "#74b9ff",
    description: "Professional Network & Career",
    offset: [-0.65, -0.95],
  },
  {
    id: "leetcode",
    name: "LeetCode",
    handle: "@shivu_codes",
    url: "https://leetcode.com/u/shivu-codes", // Replace with your actual LeetCode URL
    icon: "leetcode",
    accentColor: "#ffa502",
    description: "Algorithms & Problem Solving",
    offset: [0.75, -0.85],
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@shivu.cs",
    url: "https://instagram.com/shivu.cs", // Replace with your actual Instagram URL
    icon: "instagram",
    accentColor: "#fd79a8",
    description: "Campus Life & Tech Journey",
    offset: [1.85, 1.05],
  },
];
