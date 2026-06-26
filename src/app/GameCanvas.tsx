import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useUIStore } from '@/stores/uiStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { GL_CONFIG, CAMERA_CONFIG, dprForQuality } from '@/rendering/canvasConfig'
import { getPreset } from '@/rendering/qualityPreset'
import { PhysicsProvider } from '@/systems/PhysicsProvider'
import { Router } from '@/app/Router'
import { LoaderSetup } from '@/app/LoaderSetup'

// r3f-perf is DEV-only; lazy require to keep it out of prod bundle.
import { Perf } from 'r3f-perf'

/**
 * R3F Canvas container.
 * - GL props are mobile-optimized (no AA, high-performance).
 * - dpr / shadows are driven by the current quality tier.
 * - frameloop switches to 'never' while paused to save battery.
 */
export function GameCanvas() {
  const quality = useSettingsStore((s) => s.quality)
  const paused = useUIStore((s) => s.paused)
  const preset = getPreset(quality)

  return (
    <Canvas
      className="game-canvas"
      gl={GL_CONFIG}
      dpr={dprForQuality(quality)}
      camera={CAMERA_CONFIG}
      shadows={preset.shadows}
      frameloop={paused ? 'never' : 'always'}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <LoaderSetup />
        <PhysicsProvider>
          <Router />
        </PhysicsProvider>
      </Suspense>
      {import.meta.env.DEV && <Perf position="top-left" />}
    </Canvas>
  )
}
