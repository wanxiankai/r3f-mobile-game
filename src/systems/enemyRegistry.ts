import * as THREE from 'three'

export interface EnemyRuntime {
  id: string
  position: THREE.Vector3
  velocity: THREE.Vector3
  hp: number
  alive: boolean
}

/**
 * Plain (non-React) registry of live enemies.
 * High-frequency transform data lives here, NOT in any store, so it never
 * triggers React re-renders. <InstancedEnemies> reads it each frame.
 */
class EnemyRegistry {
  private enemies: EnemyRuntime[] = []

  add(enemy: EnemyRuntime): void {
    this.enemies.push(enemy)
  }

  all(): readonly EnemyRuntime[] {
    return this.enemies
  }

  count(): number {
    return this.enemies.length
  }

  remove(id: string): void {
    const i = this.enemies.findIndex((e) => e.id === id)
    if (i >= 0) this.enemies.splice(i, 1)
  }

  /** Remove all dead enemies; returns how many were removed. */
  prune(): number {
    const before = this.enemies.length
    this.enemies = this.enemies.filter((e) => e.alive)
    return before - this.enemies.length
  }

  clear(): void {
    this.enemies.length = 0
  }
}

export const enemyRegistry = new EnemyRegistry()
