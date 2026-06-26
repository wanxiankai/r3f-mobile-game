import type { QualityPreset, QualityTier } from '@/types/game'

/**
 * Three quality tiers. Consumed by settingsStore + rendering layer.
 * Keep these in sync with `rendering/qualityPreset.ts` (re-exported there).
 */
export const QUALITY_CONFIG: Record<QualityTier, QualityPreset> = {
  low: {
    dpr: 1,
    shadows: false,
    postprocess: false,
    maxLights: 1,
    instanceLimit: 100
  },
  mid: {
    dpr: [1, 1.5],
    shadows: false,
    postprocess: true,
    maxLights: 2,
    instanceLimit: 500
  },
  high: {
    dpr: [1, 2],
    shadows: true,
    postprocess: true,
    maxLights: 3,
    instanceLimit: 1000
  }
}

/** Map a detect-gpu tier (1-3) to a quality string. */
export function tierToQuality(tier: number): QualityTier {
  if (tier >= 3) return 'high'
  if (tier === 2) return 'mid'
  return 'low'
}
