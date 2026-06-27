export type RunnerObstacleKind = 'barrier' | 'arch' | 'blocker'

export interface RunnerRuntimeState {
  x: number
  lane: number
  targetLane: number
  y: number
  sliding: boolean
  invulnerableUntil: number
  speed: number
  distance: number
}

export const RUNNER_LANES = [-2.4, 0, 2.4] as const

export const runnerRuntime: RunnerRuntimeState = {
  x: 0,
  lane: 1,
  targetLane: 1,
  y: 0,
  sliding: false,
  invulnerableUntil: 0,
  speed: 13,
  distance: 0
}

export function resetRunnerRuntime() {
  runnerRuntime.x = 0
  runnerRuntime.lane = 1
  runnerRuntime.targetLane = 1
  runnerRuntime.y = 0
  runnerRuntime.sliding = false
  runnerRuntime.invulnerableUntil = 0
  runnerRuntime.speed = 13
  runnerRuntime.distance = 0
}
