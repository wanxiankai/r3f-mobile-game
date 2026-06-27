import { useRef } from 'react'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useGameStore } from '@/stores/gameStore'

interface WaveSystemProps {
  secondsPerLevel?: number
}

export function WaveSystem({ secondsPerLevel = 20 }: WaveSystemProps) {
  const timer = useRef(0)

  useGameLoop((delta) => {
    if (useGameStore.getState().status !== 'playing') return
    timer.current += delta
    if (timer.current < secondsPerLevel) return
    timer.current = 0
    useGameStore.getState().nextLevel()
  })

  return null
}
