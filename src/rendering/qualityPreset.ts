import { QUALITY_CONFIG, tierToQuality } from '@/config/qualityConfig'
import type { QualityPreset, QualityTier } from '@/types/game'

/**
 * Quality presets re-exported from config for the rendering layer.
 * Single source of truth lives in `config/qualityConfig.ts`.
 */
export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = QUALITY_CONFIG

export function getPreset(quality: QualityTier): QualityPreset {
  return QUALITY_PRESETS[quality]
}

export { tierToQuality }
