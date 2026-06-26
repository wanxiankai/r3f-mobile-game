import { useRef } from 'react'
import * as THREE from 'three'
import { Instances, Instance } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSettingsStore } from '@/stores/settingsStore'
import { getPreset } from '@/rendering/qualityPreset'
import { enemyRegistry } from '@/systems/enemyRegistry'
import { GAME_CONFIG } from '@/config/gameConfig'

interface InstancedEnemiesProps {
  /** Player object the enemies chase. */
  target?: React.RefObject<THREE.Object3D>
}

/**
 * GPU-instanced enemy renderer. ALL repeated enemies are drawn here in a
 * single draw call. Transforms come from the non-React enemyRegistry and are
 * updated each frame by mutating Instance refs — no React state, no re-render.
 *
 * The instance count is capped to the current quality preset's instanceLimit.
 */
export function InstancedEnemies({ target }: InstancedEnemiesProps) {
  const quality = useSettingsStore((s) => s.quality)
  const limit = getPreset(quality).instanceLimit

  const instanceRefs = useRef<(THREE.Object3D | null)[]>([])
  const tmpTarget = useRef(new THREE.Vector3())
  const dir = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const enemies = enemyRegistry.all()
    const tgt = target?.current
    if (tgt) tgt.getWorldPosition(tmpTarget.current)

    const max = Math.min(enemies.length, limit)
    for (let i = 0; i < max; i++) {
      const e = enemies[i]
      const inst = instanceRefs.current[i]
      if (!inst) continue

      // Chase the player.
      if (tgt && e.alive) {
        dir.current.copy(tmpTarget.current).sub(e.position)
        dir.current.y = 0
        const dist = dir.current.length()
        if (dist > 0.5) {
          dir.current.normalize().multiplyScalar(GAME_CONFIG.enemy.speed * delta)
          e.position.add(dir.current)
        }
      }

      inst.position.copy(e.position)
      inst.visible = e.alive
      inst.updateMatrix()
    }

    // Hide unused instances beyond the active enemy count.
    for (let i = max; i < limit; i++) {
      const inst = instanceRefs.current[i]
      if (inst) inst.visible = false
    }
  })

  return (
    <Instances limit={limit} castShadow={false} frustumCulled={false}>
      {/* TODO: 替换为真实敌人模型 geometry/material */}
      <boxGeometry args={[0.8, 1, 0.8]} />
      <meshStandardMaterial color="#ef476f" />
      {Array.from({ length: limit }).map((_, i) => (
        <Instance
          key={i}
          ref={(el: THREE.Object3D | null) => {
            instanceRefs.current[i] = el
          }}
          visible={false}
        />
      ))}
    </Instances>
  )
}
