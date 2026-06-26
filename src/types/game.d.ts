/**
 * Shared game-domain types.
 */

export type SceneName = 'loading' | 'menu' | 'game' | 'gameover'

export type GameStatus = 'idle' | 'playing' | 'paused' | 'over'

export type QualityTier = 'low' | 'mid' | 'high'

/** Normalized 2D input vector, components in range [-1, 1]. */
export interface InputVector {
  x: number
  y: number
}

/** A quality preset entry. dpr may be a fixed number or a [min, max] clamp range. */
export interface QualityPreset {
  dpr: number | [number, number]
  shadows: boolean
  postprocess: boolean
  maxLights: number
  instanceLimit: number
}

/** Minimal description of a spawned enemy held outside React state. */
export interface EnemyData {
  id: string
  alive: boolean
  hp: number
}
