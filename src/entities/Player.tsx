import { forwardRef, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'
import {
  RigidBody,
  CapsuleCollider,
  type RapierRigidBody
} from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { getInput } from '@/stores/inputStore'
import { GAME_CONFIG } from '@/config/gameConfig'
import { ASSET_MANIFEST } from '@/loaders/assetManifest'
import { OptionalGLTFModel, useOptionalAsset } from '@/loaders/useOptionalGLTF'

export interface PlayerHandle {
  /** Visual group, used by CameraRig to follow the player. */
  group: THREE.Group | null
}

/**
 * Player entity (R3F + Rapier).
 *
 * Performance rules applied:
 * - Position/velocity NEVER go into React state — we mutate the RigidBody.
 * - Input is read via getInput() (getState), no per-frame subscription.
 * - No setState inside useFrame.
 */
export const Player = forwardRef<PlayerHandle>(function Player(_props, ref) {
  const hasPlayerModel = useOptionalAsset(ASSET_MANIFEST.models.player)

  const bodyRef = useRef<RapierRigidBody>(null)
  const groupRef = useRef<THREE.Group>(null)
  const impulse = useRef(new THREE.Vector3())
  const linvel = useRef(new THREE.Vector3())

  useImperativeHandle(ref, () => ({ group: groupRef.current }), [])

  useFrame(() => {
    const body = bodyRef.current
    if (!body) return

    const { move } = getInput()
    const speed = GAME_CONFIG.player.moveSpeed

    // Target horizontal velocity from input (XZ plane). y from joystick maps to -z (forward).
    const targetVx = move.x * speed
    const targetVz = -move.y * speed

    const current = body.linvel()
    linvel.current.set(targetVx, current.y, targetVz)
    body.setLinvel(linvel.current, true)

    // Face movement direction.
    if (groupRef.current && (move.x !== 0 || move.y !== 0)) {
      const angle = Math.atan2(targetVx, targetVz)
      groupRef.current.rotation.y = angle
    }

    // Jump (one-shot, consumed from store to avoid double jumps).
    if (getInput().consumeJump() && Math.abs(current.y) < 0.05) {
      impulse.current.set(0, GAME_CONFIG.player.jumpImpulse, 0)
      body.applyImpulse(impulse.current, true)
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      type="dynamic"
      position={GAME_CONFIG.player.startPosition}
      enabledRotations={[false, true, false]}
      linearDamping={0.5}
      canSleep={false}
    >
      <CapsuleCollider
        args={[GAME_CONFIG.player.capsuleHalfHeight, GAME_CONFIG.player.capsuleRadius]}
      />
      <group ref={groupRef}>
        {hasPlayerModel ? (
          <OptionalGLTFModel url={ASSET_MANIFEST.models.player} />
        ) : (
          // TODO: 替换为真实玩家模型 (assets/models/player.glb)
          <mesh castShadow>
            <capsuleGeometry
              args={[GAME_CONFIG.player.capsuleRadius, GAME_CONFIG.player.capsuleHalfHeight * 2, 8, 16]}
            />
            <meshStandardMaterial color="#4cc9f0" />
          </mesh>
        )}
      </group>
    </RigidBody>
  )
})
