import { create } from 'zustand'
import type { QualityTier } from '@/types/game'

interface PerformanceState {
  fps: number
  averageFps: number
  frameTimeMs: number
  downgradeCount: number
  lastDowngradeFrom: QualityTier | null
  setSample: (sample: { fps: number; averageFps: number; frameTimeMs: number }) => void
  markDowngrade: (from: QualityTier) => void
  resetPerformance: () => void
}

export const usePerformanceStore = create<PerformanceState>((set, get) => ({
  fps: 0,
  averageFps: 0,
  frameTimeMs: 0,
  downgradeCount: 0,
  lastDowngradeFrom: null,

  setSample: (sample) => set(sample),
  markDowngrade: (from) =>
    set({
      downgradeCount: get().downgradeCount + 1,
      lastDowngradeFrom: from
    }),
  resetPerformance: () =>
    set({
      fps: 0,
      averageFps: 0,
      frameTimeMs: 0,
      downgradeCount: 0,
      lastDowngradeFrom: null
    })
}))
