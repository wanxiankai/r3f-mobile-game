import { RigidBody } from '@react-three/rapier'
import { GAME_CONFIG } from '@/config/gameConfig'

/**
 * Static ground plane with a fixed Rapier collider.
 * Uses a thin box (cuboid collider) rather than an infinite plane for stability.
 */
export function Ground() {
  const size = GAME_CONFIG.world.groundSize

  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow rotation={[0, 0, 0]} position={[0, -0.05, 0]}>
        <boxGeometry args={[size, 0.1, size]} />
        {/* TODO: 替换为 KTX2 地面材质 (assets/textures/ground.ktx2) */}
        <meshStandardMaterial color="#1b2230" />
      </mesh>
    </RigidBody>
  )
}
