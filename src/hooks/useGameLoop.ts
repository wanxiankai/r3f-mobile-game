import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useUIStore } from '@/stores/uiStore'

type LoopCallback = (delta: number, elapsed: number) => void

/**
 * Helper that registers a per-frame callback which automatically no-ops while
 * the game is paused (read via getState, never subscribed — no re-renders).
 *
 * IMPORTANT: do NOT call setState inside the callback.
 */
export function useGameLoop(callback: LoopCallback): void {
  const elapsedRef = useRef(0)

  useFrame((_, delta) => {
    if (useUIStore.getState().paused) return
    // Clamp delta to avoid huge jumps after tab switches.
    const dt = Math.min(delta, 1 / 20)
    elapsedRef.current += dt
    callback(dt, elapsedRef.current)
  })
}
