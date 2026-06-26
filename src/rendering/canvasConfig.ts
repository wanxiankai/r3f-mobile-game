import type { QualityTier } from '@/types/game'
import { getPreset } from '@/rendering/qualityPreset'

/** Static GL props for the Canvas — mobile-optimized. */
export const GL_CONFIG = {
  antialias: false,
  powerPreference: 'high-performance' as const,
  stencil: false,
  alpha: false,
  depth: true
}

export const CAMERA_CONFIG = {
  position: [0, 5, 10] as [number, number, number],
  fov: 60,
  near: 0.1,
  far: 1000
}

/** dpr clamp range chosen by current quality tier (upper bound 2). */
export function dprForQuality(quality: QualityTier): number | [number, number] {
  return getPreset(quality).dpr
}
