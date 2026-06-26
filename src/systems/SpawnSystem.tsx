import { useRef } from 'react'
import * as THREE from 'three'
import { useGameLoop } from '@/hooks/useGameLoop'
import { GAME_CONFIG } from '@/config/gameConfig'
import { randomPointOnCircleXZ, uuid } from '@/utils/mathUtil'
import { enemyRegistry } from '@/systems/enemyRegistry'

/**
 * Spawns enemies on a timer up to a cap. Enemy transforms live in the
 * shared `enemyRegistry` (plain arrays), consumed by <InstancedEnemies>.
 * No React state churn — purely timer + registry mutation.
 */
export function SpawnSystem() {
  const timer = useRef(0)

  useGameLoop((delta) => {
    timer.current += delta
    if (timer.current < GAME_CONFIG.enemy.spawnInterval) return
    timer.current = 0

    if (enemyRegistry.count() >= GAME_CONFIG.enemy.maxAlive) return

    const pos = randomPointOnCircleXZ(GAME_CONFIG.world.groundSize * 0.4)
    pos.y = 0.5
    enemyRegistry.add({
      id: uuid(),
      position: pos,
      velocity: new THREE.Vector3(),
      hp: GAME_CONFIG.enemy.hp,
      alive: true
    })
  })

  return null
}
