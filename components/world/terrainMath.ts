import * as THREE from "three";

/**
 * Shared procedural terrain and pathway mathematics for ShivuVerse.
 * Guarantees all nature elements (trees, rocks, flowers, path, stream)
 * align naturally with the ground elevation.
 */

export const TERRAIN_SIZE = 150;
export const TERRAIN_SEGMENTS = 120;

// Path centerline at any world Z coordinate
export function getPathX(worldZ: number): number {
  return Math.sin(worldZ * 0.04) * 3.5 + Math.sin(worldZ * 0.015) * 2.0;
}

// Stream centerline curve at any world Z coordinate
export function getStreamX(worldZ: number): number {
  // Flows from waterfall at [16, -28] down to foreground at [9, 24]
  const t = (worldZ + 30) / 54; // 0 at -30, 1 at +24
  const baseCurve = 16 - t * 8.5;
  const meander = Math.sin(worldZ * 0.09) * 1.8 + Math.cos(worldZ * 0.04) * 1.2;
  return baseCurve + meander;
}

// Distance from given point to stream centerline (for worldZ between -32 and 26)
export function getDistToStream(worldX: number, worldZ: number): number {
  if (worldZ < -32 || worldZ > 26) return 999;
  const streamX = getStreamX(worldZ);
  return Math.abs(worldX - streamX);
}

// Waterfall and clearing anchors
export const WORKSHOP_CENTER = { x: -7.8, z: -10.5 };
export const GARDEN_CENTER = { x: 7.4, z: -4.2 };
export const WATERFALL_CENTER = { x: 16.2, z: -28.2 };
export const TREE_CENTER = { x: 4.8, z: -21.8 };
export const GROVE_CENTER = { x: 6.2, z: -29.0 };
export const ABOUT_CENTER = { x: -7.2, z: -35.5 };
export const OVERLOOK_CENTER = { x: -4.2, z: -42.0 };

// Get the exact ground elevation Y at any (worldX, worldZ) coordinate
export function getTerrainHeight(worldX: number, worldZ: number): number {
  const pathX = getPathX(worldZ);
  const distToPath = Math.abs(worldX - pathX);

  // Transition factor: 0 on path, 1 on hills
  const pathFactor = Math.min(Math.max((distToPath - 3.8) / 9.5, 0), 1);

  // Rolling hills
  const rollingHills =
    Math.sin(worldX * 0.065 + worldZ * 0.045) * 2.6 +
    Math.cos(worldX * 0.04 - worldZ * 0.065) * 2.4 +
    Math.sin(worldX * 0.14) * Math.cos(worldZ * 0.12) * 0.7;

  // Natural organic micro-undulation to eliminate flat surface planes
  const microUndulation =
    (Math.sin(worldX * 0.18) * Math.cos(worldZ * 0.16) * 0.35 +
      Math.sin(worldX * 0.32 + worldZ * 0.22) * 0.16) *
    pathFactor;

  // Outer framing ridges
  const outerRidges =
    Math.pow(Math.min(Math.abs(worldX) / (TERRAIN_SIZE * 0.38), 1), 2.2) * 6.5;

  // Subtle path variation
  const pathSubtle = Math.sin(worldZ * 0.08) * 0.25;

  let elevation =
    rollingHills * Math.pow(pathFactor, 1.4) +
    microUndulation +
    outerRidges +
    pathSubtle * (1 - pathFactor);

  // Waterfall rock bluff ridge: center ridge behind waterfall [17.5, -31.5]
  const distToWaterfallCliff = Math.hypot(worldX - 17.5, worldZ - (-31.5));
  if (distToWaterfallCliff < 13) {
    const cliffFactor = Math.cos((distToWaterfallCliff / 13) * (Math.PI / 2));
    elevation += Math.pow(cliffFactor, 1.5) * 7.0;
  }

  // Carve gentle bed for the stream with smooth taper approaching plunge pool
  const distToStream = getDistToStream(worldX, worldZ);
  if (distToStream < 4.5 && worldZ > -30) {
    const streamBedCarve = Math.cos((distToStream / 4.5) * (Math.PI / 2)) * 0.65;
    const zTaper = Math.min(Math.max((worldZ - (-30)) / 3.5, 0), 1);
    elevation -= streamBedCarve * zTaper;
  }

  // Smooth plateau for Project Workshop clearing
  const distToWorkshop = Math.hypot(worldX - WORKSHOP_CENTER.x, worldZ - WORKSHOP_CENTER.z);
  if (distToWorkshop < 4.6) {
    const blend = Math.pow(Math.cos((distToWorkshop / 4.6) * (Math.PI / 2)), 2);
    const plateauHeight = 1.15; // Stable clearing height
    elevation = elevation * (1 - blend) + plateauHeight * blend;
  }

  // Smooth plateau for Social Garden clearing
  const distToGarden = Math.hypot(worldX - GARDEN_CENTER.x, worldZ - GARDEN_CENTER.z);
  if (distToGarden < 3.8) {
    const blend = Math.pow(Math.cos((distToGarden / 3.8) * (Math.PI / 2)), 2);
    const plateauHeight = 0.85; // Stable clearing height
    elevation = elevation * (1 - blend) + plateauHeight * blend;
  }

  // Smooth plateau for Certificate Grove clearing
  const distToGrove = Math.hypot(worldX - GROVE_CENTER.x, worldZ - GROVE_CENTER.z);
  if (distToGrove < 4.2) {
    const blend = Math.pow(Math.cos((distToGrove / 4.2) * (Math.PI / 2)), 2);
    const plateauHeight = 1.1; // Stable grove height
    elevation = elevation * (1 - blend) + plateauHeight * blend;
  }

  // Smooth plateau for About Me camp clearing
  const distToAbout = Math.hypot(worldX - ABOUT_CENTER.x, worldZ - ABOUT_CENTER.z);
  if (distToAbout < 4.5) {
    const blend = Math.pow(Math.cos((distToAbout / 4.5) * (Math.PI / 2)), 2);
    const plateauHeight = 1.25; // Stable camp clearing height
    elevation = elevation * (1 - blend) + plateauHeight * blend;
  }

  // Smooth plateau for Final Contact Overlook
  const distToOverlook = Math.hypot(worldX - OVERLOOK_CENTER.x, worldZ - OVERLOOK_CENTER.z);
  if (distToOverlook < 4.5) {
    const blend = Math.pow(Math.cos((distToOverlook / 4.5) * (Math.PI / 2)), 2);
    const plateauHeight = 1.35; // Stable overlook deck height
    elevation = elevation * (1 - blend) + plateauHeight * blend;
  }

  return elevation;
}
