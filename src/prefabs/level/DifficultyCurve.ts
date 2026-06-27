import { GAME_CONFIG } from '@/config/gameConfig'

export interface DifficultySnapshot {
  level: number
  spawnInterval: number
  enemySpeed: number
  maxAlive: number
}

export function getDifficultySnapshot(level: number): DifficultySnapshot {
  const normalized = Math.max(1, level)
  return {
    level: normalized,
    spawnInterval: Math.max(0.45, GAME_CONFIG.enemy.spawnInterval - (normalized - 1) * 0.12),
    enemySpeed: GAME_CONFIG.enemy.speed * (1 + (normalized - 1) * 0.08),
    maxAlive: Math.min(GAME_CONFIG.enemy.maxAlive + (normalized - 1) * 5, 120)
  }
}
