import { Physics } from '@react-three/rapier'
import type { ReactNode } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { GAME_CONFIG } from '@/config/gameConfig'

/**
 * Rapier physics root. Pauses with the UI store and follows R3F delta
 * via timeStep="vary". Interpolation smooths motion at high render FPS.
 */
export function PhysicsProvider({ children }: { children: ReactNode }) {
  const paused = useUIStore((s) => s.paused)

  return (
    <Physics
      gravity={GAME_CONFIG.world.gravity}
      timeStep="vary"
      paused={paused}
      interpolate={true}
    >
      {children}
    </Physics>
  )
}
