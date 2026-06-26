import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { useSettingsStore } from '@/stores/settingsStore'
import { Lights } from '@/components/three/Lights'
import { Environment } from '@/components/three/Environment'
import { InstancedEnemies } from '@/components/three/InstancedEnemies'
import { CameraRig } from '@/systems/CameraRig'
import { InputSystem } from '@/systems/InputSystem'
import { SpawnSystem } from '@/systems/SpawnSystem'
import { Ground } from '@/entities/Ground'
import { Player, type PlayerHandle } from '@/entities/Player'
import { Postprocess } from '@/rendering/postprocess'

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

  return (
    <>
      <Environment />
      <Lights />

      <Suspense fallback={null}>
        <Player ref={bindPlayer} />
      </Suspense>

      <Ground />
      <InstancedEnemies target={playerTarget} />

      {/* Systems (render nothing, drive the loop) */}
      <CameraRig target={playerTarget} />
      <InputSystem />
      <SpawnSystem />

      {/* Post-processing only when quality allows it */}
      {quality !== 'low' && <Postprocess />}
    </>
  )
}
