import { create } from 'zustand'
import type { GameStatus } from '@/types/game'
import { GAME_CONFIG } from '@/config/gameConfig'

interface GameState {
  score: number
  lives: number
  level: number
  status: GameStatus

  addScore: (amount: number) => void
  loseLife: () => void
  setStatus: (status: GameStatus) => void
  nextLevel: () => void
  reset: () => void
}

const INITIAL = {
  score: 0,
  lives: GAME_CONFIG.player_lives,
  level: 1,
  status: 'idle' as GameStatus
}

/**
 * Low-frequency game state only (score, lives, level, status).
 * High-frequency data (positions, velocities) MUST NOT live here —
 * mutate Three.js / Rapier objects directly via refs instead.
 */
export const useGameStore = create<GameState>((set, get) => ({
  ...INITIAL,

  addScore: (amount) => set({ score: get().score + amount }),

  loseLife: () => {
    const lives = Math.max(0, get().lives - 1)
    set({ lives, status: lives <= 0 ? 'over' : get().status })
  },

  setStatus: (status) => set({ status }),

  nextLevel: () => set({ level: get().level + 1 }),

  reset: () => set({ ...INITIAL })
}))
