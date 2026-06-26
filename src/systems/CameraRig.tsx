import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useRef } from 'react'
import { GAME_CONFIG } from '@/config/gameConfig'

interface CameraRigProps {
  /** Object the camera should follow (usually the player group). */
  target?: React.RefObject<THREE.Object3D>
}

/**
 * Smooth third-person follow camera.
 * Reads target position from a ref each frame and damps the camera toward it.
 * No React state — pure Three.js mutation.
 */
export function CameraRig({ target }: CameraRigProps) {
  const camera = useThree((s) => s.camera)
  const desired = useRef(new THREE.Vector3())
  const lookAt = useRef(new THREE.Vector3())
  const offset = new THREE.Vector3(...GAME_CONFIG.camera.offset)

  useFrame((_, delta) => {
    const obj = target?.current
    if (!obj) return

    obj.getWorldPosition(lookAt.current)
    desired.current.copy(lookAt.current).add(offset)

    // Framerate-independent smoothing.
    const t = 1 - Math.pow(1 - GAME_CONFIG.camera.lerp, delta * 60)
    camera.position.lerp(desired.current, t)
    camera.lookAt(lookAt.current)
  })

  return null
}
