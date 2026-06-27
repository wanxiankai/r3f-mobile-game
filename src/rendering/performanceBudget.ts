import type { QualityTier } from '@/types/game'

export interface PerformanceBudget {
  targetFps: number
  downgradeBelowFps: number
  downgradeAfterSeconds: number
  sampleInterval: number
}

export const PERFORMANCE_BUDGET: Record<QualityTier, PerformanceBudget> = {
  low: {
    targetFps: 30,
    downgradeBelowFps: 24,
    downgradeAfterSeconds: 8,
    sampleInterval: 1
  },
  mid: {
    targetFps: 45,
    downgradeBelowFps: 32,
    downgradeAfterSeconds: 6,
    sampleInterval: 1
  },
  high: {
    targetFps: 55,
    downgradeBelowFps: 42,
    downgradeAfterSeconds: 5,
    sampleInterval: 1
  }
}

export function downgradeQuality(quality: QualityTier): QualityTier {
  if (quality === 'high') return 'mid'
  if (quality === 'mid') return 'low'
  return 'low'
}
