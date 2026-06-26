import { useEffect, useState } from 'react'
import { getGPUTier } from 'detect-gpu'
import { useSettingsStore } from '@/stores/settingsStore'
import { tierToQuality } from '@/config/qualityConfig'
import type { QualityTier } from '@/types/game'

interface DeviceTierResult {
  /** detect-gpu tier 1-3 (0 while detecting). */
  tier: number
  quality: QualityTier
  detected: boolean
}

/**
 * Detect device GPU tier once and write the resulting quality preset into
 * settingsStore (unless the user already detected/overrode it).
 */
export function useDeviceTier(): DeviceTierResult {
  const quality = useSettingsStore((s) => s.quality)
  const detected = useSettingsStore((s) => s.qualityDetected)
  const [tier, setTier] = useState(0)

  useEffect(() => {
    let cancelled = false

    if (detected) {
      setTier(quality === 'high' ? 3 : quality === 'mid' ? 2 : 1)
      return
    }

    getGPUTier()
      .then((result) => {
        if (cancelled) return
        const t = result.tier ?? 1
        setTier(t)
        const { setQuality, markQualityDetected } = useSettingsStore.getState()
        setQuality(tierToQuality(t))
        markQualityDetected()
      })
      .catch(() => {
        if (cancelled) return
        setTier(1)
        useSettingsStore.getState().setQuality('low')
        useSettingsStore.getState().markQualityDetected()
      })

    return () => {
      cancelled = true
    }
  }, [detected, quality])

  return { tier, quality, detected }
}
