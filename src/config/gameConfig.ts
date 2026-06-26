/**
 * Central place for game balance / tuning numbers.
 * Avoid scattering magic numbers across entities and systems.
 */
export const GAME_CONFIG = {
  player: {
    moveSpeed: 6, // units / second
    maxLinearSpeed: 8,
    jumpImpulse: 5,
    capsuleRadius: 0.5,
    capsuleHalfHeight: 0.5,
    startPosition: [0, 1.5, 0] as [number, number, number]
  },
  bullet: {
    speed: 20,
    lifetime: 2, // seconds
    radius: 0.15,
    poolSize: 64
  },
  enemy: {
    speed: 2,
    hp: 3,
    spawnInterval: 1.5, // seconds
    maxAlive: 50,
    scorePerKill: 10
  },
  player_lives: 3,
  world: {
    groundSize: 60,
    gravity: [0, -9.81, 0] as [number, number, number]
  },
  camera: {
    offset: [0, 6, 10] as [number, number, number],
    lerp: 0.08
  }
} as const

export type GameConfig = typeof GAME_CONFIG
