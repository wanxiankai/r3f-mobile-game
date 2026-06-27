import { useRef } from 'react'
import * as THREE from 'three'
import { useSettingsStore } from '@/stores/settingsStore'
import type { PlayerHandle } from '@/entities/Player'
import { CURRENT_GAME_DEFINITION } from '@/game-definitions/current'
import { renderSystems } from '@/core/systemRegistry'
import type { GameSceneContext } from '@/core/gameDefinition'

/**
 * The in-Canvas game scene. Composes all runtime 3D components.
 * Rendered inside <PhysicsProvider> from the Router; assets wrapped in Suspense.
 */
export function GameScene() {
  const quality = useSettingsStore((s) => s.quality)
  const playerHandle = useRef<PlayerHandle>(null)
  const playerTarget = useRef<THREE.Object3D | null>(null)

  // Bridge: expose the player's group as a plain ref for camera/enemies.
  const bindPlayer = (h: PlayerHandle | null) => {
    playerHandle.current = h
    playerTarget.current = h?.group ?? null
  }

  const context: GameSceneContext = {
    quality,
    playerTarget,
    bindPlayer
  }

  return <>{renderSystems(CURRENT_GAME_DEFINITION.systems, context)}</>
}
