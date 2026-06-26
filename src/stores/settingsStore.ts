import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { QualityTier } from '@/types/game'

interface SettingsState {
  quality: QualityTier
  /** True once device tier detection has resolved. */
  qualityDetected: boolean
  bgmVolume: number // 0..1
  sfxVolume: number // 0..1

  setQuality: (q: QualityTier) => void
  markQualityDetected: () => void
  setBgmVolume: (v: number) => void
  setSfxVolume: (v: number) => void
}

/**
 * User settings persisted to localStorage.
 * Subscribe with selectors. The audio manager listens to volume changes.
 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      quality: 'mid',
      qualityDetected: false,
      bgmVolume: 0.6,
      sfxVolume: 0.8,

      setQuality: (quality) => set({ quality }),
      markQualityDetected: () => set({ qualityDetected: true }),
      setBgmVolume: (bgmVolume) => set({ bgmVolume }),
      setSfxVolume: (sfxVolume) => set({ sfxVolume })
    }),
    {
      name: 'r3f-game-settings',
      // Don't persist the transient detection flag.
      partialize: (s) => ({
        quality: s.quality,
        bgmVolume: s.bgmVolume,
        sfxVolume: s.sfxVolume
      })
    }
  )
)
