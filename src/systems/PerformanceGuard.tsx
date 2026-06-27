import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useSettingsStore } from '@/stores/settingsStore'
import { usePerformanceStore } from '@/stores/performanceStore'
import { PERFORMANCE_BUDGET, downgradeQuality } from '@/rendering/performanceBudget'

export function PerformanceGuard() {
  const frameCount = useRef(0)
  const sampleElapsed = useRef(0)
  const lowFpsElapsed = useRef(0)
  const averageFps = useRef(0)

  useFrame((_, delta) => {
    const quality = useSettingsStore.getState().quality
    const budget = PERFORMANCE_BUDGET[quality]

    frameCount.current += 1
    sampleElapsed.current += delta

    if (sampleElapsed.current < budget.sampleInterval) return

    const fps = frameCount.current / sampleElapsed.current
    averageFps.current = averageFps.current === 0 ? fps : averageFps.current * 0.85 + fps * 0.15
    usePerformanceStore.getState().setSample({
      fps,
      averageFps: averageFps.current,
      frameTimeMs: fps > 0 ? 1000 / fps : 0
    })

    if (fps < budget.downgradeBelowFps) {
      lowFpsElapsed.current += sampleElapsed.current
    } else {
      lowFpsElapsed.current = 0
    }

    if (lowFpsElapsed.current >= budget.downgradeAfterSeconds && quality !== 'low') {
      useSettingsStore.getState().setQuality(downgradeQuality(quality))
      usePerformanceStore.getState().markDowngrade(quality)
      lowFpsElapsed.current = 0
    }

    frameCount.current = 0
    sampleElapsed.current = 0
  })

  return null
}
