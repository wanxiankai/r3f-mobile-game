import { useRef } from 'react'
import * as THREE from 'three'
import { Instances, Instance } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GAME_CONFIG } from '@/config/gameConfig'
import { getInput } from '@/stores/inputStore'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { getPreset } from '@/rendering/qualityPreset'
import { enemyRegistry } from '@/systems/enemyRegistry'
import { uuid } from '@/utils/mathUtil'
import { projectileRegistry } from '@/prefabs/projectiles/projectileRegistry'
import { audioManager } from '@/audio/audioManager'
import { hapticsManager } from '@/utils/haptics'

interface ProjectileSystemProps {
  owner?: React.RefObject<THREE.Object3D | null>
  fireInterval?: number
}

export function ProjectileSystem({ owner, fireInterval = 0.18 }: ProjectileSystemProps) {
  const quality = useSettingsStore((s) => s.quality)
  const limit = Math.min(GAME_CONFIG.bullet.poolSize, getPreset(quality).instanceLimit)
  const instanceRefs = useRef<(THREE.Object3D | null)[]>([])
  const fireTimer = useRef(0)
  const ownerPosition = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3(0, 0, -1))

  useFrame((_, delta) => {
    if (useGameStore.getState().status !== 'playing') return

    fireTimer.current += delta
    if (getInput().firing && fireTimer.current >= fireInterval) {
      fireTimer.current = 0
      spawnProjectile(owner, ownerPosition.current, direction.current)
      audioManager.playSFX('shoot')
    }

    updateProjectiles(delta)
    renderProjectiles(instanceRefs.current, limit)
  })

  return (
    <Instances limit={limit} castShadow={false} frustumCulled={false}>
      <sphereGeometry args={[GAME_CONFIG.bullet.radius, 8, 8]} />
      <meshBasicMaterial color="#ffd166" />
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

function spawnProjectile(
  owner: React.RefObject<THREE.Object3D | null> | undefined,
  ownerPosition: THREE.Vector3,
  direction: THREE.Vector3
) {
  if (projectileRegistry.count() >= GAME_CONFIG.bullet.poolSize) return

  if (owner?.current) {
    owner.current.getWorldPosition(ownerPosition)
    direction.set(0, 0, -1).applyQuaternion(owner.current.quaternion).normalize()
  } else {
    ownerPosition.set(0, 1, 0)
    direction.set(0, 0, -1)
  }

  projectileRegistry.add({
    id: uuid(),
    alive: true,
    position: ownerPosition.clone().addScaledVector(direction, 0.8),
    direction: direction.clone(),
    speed: GAME_CONFIG.bullet.speed,
    radius: GAME_CONFIG.bullet.radius,
    life: 0,
    maxLife: GAME_CONFIG.bullet.lifetime,
    damage: 1
  })
}

function updateProjectiles(delta: number) {
  const projectiles = projectileRegistry.mutable()
  const enemies = enemyRegistry.all()

  for (const projectile of projectiles) {
    if (!projectile.alive) continue
    projectile.life += delta
    if (projectile.life >= projectile.maxLife) {
      projectile.alive = false
      continue
    }

    projectile.position.addScaledVector(projectile.direction, projectile.speed * delta)

    for (const enemy of enemies) {
      if (!enemy.alive) continue
      const hitDistance = projectile.radius + 0.55
      if (projectile.position.distanceToSquared(enemy.position) > hitDistance * hitDistance) continue
      projectile.alive = false
      enemy.hp -= projectile.damage
      if (enemy.hp <= 0) {
        enemy.alive = false
        useGameStore.getState().addScore(GAME_CONFIG.enemy.scorePerKill)
        audioManager.playSFX('hit')
        hapticsManager.pulse('success')
      }
      break
    }
  }

  projectileRegistry.prune()
  enemyRegistry.prune()
}

function renderProjectiles(instanceRefs: (THREE.Object3D | null)[], limit: number) {
  const projectiles = projectileRegistry.all()
  const max = Math.min(projectiles.length, limit)

  for (let i = 0; i < max; i++) {
    const projectile = projectiles[i]
    const inst = instanceRefs[i]
    if (!inst) continue
    inst.position.copy(projectile.position)
    inst.visible = projectile.alive
    inst.updateMatrix()
  }

  for (let i = max; i < limit; i++) {
    const inst = instanceRefs[i]
    if (inst) inst.visible = false
  }
}
