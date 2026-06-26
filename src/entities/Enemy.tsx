import { useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { ASSET_MANIFEST } from '@/loaders/assetManifest'
import { GAME_CONFIG } from '@/config/gameConfig'

interface EnemyProps {
  position?: [number, number, number]
  target?: React.RefObject<THREE.Object3D>
}

/**
 * Single non-instanced enemy entity.
 *
 * NOTE: For large numbers of enemies use <InstancedEnemies> instead — this
 * component is kept for special / boss enemies that need unique logic.
 * Movement mutates the mesh directly (no React state).
 */
export function Enemy({ position = [0, 0.5, 0], target }: EnemyProps) {
  const gltf = useGLTF(ASSET_MANIFEST.models.enemy) as unknown as { scene?: THREE.Group }
  const ref = useRef<THREE.Group>(null)
  const dir = useRef(new THREE.Vector3())
  const tmp = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const self = ref.current
    if (!self || !target?.current) return
    target.current.getWorldPosition(tmp.current)
    dir.current.copy(tmp.current).sub(self.position)
    dir.current.y = 0
    const dist = dir.current.length()
    if (dist > 0.5) {
      dir.current.normalize().multiplyScalar(GAME_CONFIG.enemy.speed * delta)
      self.position.add(dir.current)
      self.rotation.y = Math.atan2(dir.current.x, dir.current.z)
    }
  })

  return (
    <group ref={ref} position={position}>
      {gltf?.scene ? (
        <primitive object={gltf.scene.clone()} />
      ) : (
        // TODO: 替换为真实敌人模型 (assets/models/enemy.glb)
        <mesh castShadow>
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial color="#ef476f" />
        </mesh>
      )}
    </group>
  )
}
