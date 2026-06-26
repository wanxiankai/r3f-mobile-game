import { useRef } from 'react'
import * as THREE from 'three'
import { RigidBody, BallCollider, type RapierRigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { GAME_CONFIG } from '@/config/gameConfig'

interface BulletProps {
  position: [number, number, number]
  direction: [number, number, number]
  onExpire?: () => void
}

/**
 * Single bullet. For high fire rates prefer a pooled / instanced approach,
 * but this demonstrates the standard R3F + Rapier kinematic projectile.
 * Lifetime is tracked in a ref; expiry is reported via callback (parent removes).
 */
export function Bullet({ position, direction, onExpire }: BulletProps) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const life = useRef(0)
  const vel = useRef(
    new THREE.Vector3(...direction).normalize().multiplyScalar(GAME_CONFIG.bullet.speed)
  )

  useFrame((_, delta) => {
    const body = bodyRef.current
    if (!body) return
    body.setLinvel(vel.current, true)

    life.current += delta
    if (life.current >= GAME_CONFIG.bullet.lifetime) {
      onExpire?.()
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      type="dynamic"
      colliders={false}
      gravityScale={0}
      ccd
      position={position}
    >
      <BallCollider args={[GAME_CONFIG.bullet.radius]} sensor />
      <mesh>
        <sphereGeometry args={[GAME_CONFIG.bullet.radius, 8, 8]} />
        <meshBasicMaterial color="#ffd166" />
      </mesh>
    </RigidBody>
  )
}
