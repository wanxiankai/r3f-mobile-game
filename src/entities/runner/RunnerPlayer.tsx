import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { getInput } from '@/stores/inputStore'
import type { PlayerHandle } from '@/entities/Player'
import { RUNNER_LANES, runnerRuntime } from '@/systems/runner/runnerRuntime'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import { ASSET_MANIFEST } from '@/loaders/assetManifest'

const LANE_CHANGE_COOLDOWN = 0.18
const JUMP_DURATION = 0.72
const JUMP_HEIGHT = 2.65
const SLIDE_DURATION = 0.58

export const RunnerPlayer = forwardRef<PlayerHandle>(function RunnerPlayer(_props, ref) {
  const groupRef = useRef<THREE.Group>(null)
  const modelRef = useRef<THREE.Group>(null)
  const rigRef = useRef<THREE.Group>(null)
  const laneCooldown = useRef(0)
  const jumpTime = useRef(0)
  const slideTime = useRef(0)
  const squash = useRef(1)
  const currentAction = useRef<THREE.AnimationAction | null>(null)
  const activeMotion = useRef<'run' | 'jump' | 'slide'>('run')
  const { scene, animations } = useGLTF(ASSET_MANIFEST.models.player)
  const { actions } = useAnimations(animations, modelRef)

  useImperativeHandle(ref, () => ({ group: groupRef.current }), [])

  useEffect(() => {
    scene.traverse((object) => {
      if ('isMesh' in object && object.isMesh) {
        object.castShadow = true
        object.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    const running = actions.Running
    if (!running) return
    running.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.18).play()
    running.timeScale = 1.18
    currentAction.current = running
    activeMotion.current = 'run'

    return () => {
      Object.values(actions).forEach((action) => action?.stop())
    }
  }, [actions])

  useFrame((_, delta) => {
    if (useUIStore.getState().paused || useGameStore.getState().status !== 'playing') return

    const input = getInput()
    laneCooldown.current = Math.max(0, laneCooldown.current - delta)

    if (laneCooldown.current <= 0 && Math.abs(input.move.x) > 0.55) {
      runnerRuntime.targetLane = THREE.MathUtils.clamp(
        runnerRuntime.targetLane + Math.sign(input.move.x),
        0,
        RUNNER_LANES.length - 1
      )
      laneCooldown.current = LANE_CHANGE_COOLDOWN
    }

    if (input.consumeJump() && jumpTime.current <= 0.02) {
      jumpTime.current = JUMP_DURATION
      playMotion(actions.Jump, 'jump', currentAction, activeMotion, {
        loop: THREE.LoopOnce,
        fade: 0.08,
        timeScale: 1.35
      })
    }

    if (input.move.y < -0.6 || input.actions.slide) {
      slideTime.current = SLIDE_DURATION
    } else {
      slideTime.current = Math.max(0, slideTime.current - delta)
    }

    const targetX = RUNNER_LANES[runnerRuntime.targetLane]
    const nextX = THREE.MathUtils.damp(runnerRuntime.x, targetX, 14, delta)
    runnerRuntime.x = nextX

    if (Math.abs(nextX - targetX) < 0.04) runnerRuntime.lane = runnerRuntime.targetLane
    else {
      const closest = RUNNER_LANES.reduce((best, lane, index) => {
        return Math.abs(lane - nextX) < Math.abs(RUNNER_LANES[best] - nextX) ? index : best
      }, runnerRuntime.lane)
      runnerRuntime.lane = closest
    }

    if (jumpTime.current > 0) jumpTime.current = Math.max(0, jumpTime.current - delta)
    const jumpProgress = jumpTime.current / JUMP_DURATION
    const jumpY = Math.sin(jumpProgress * Math.PI) * JUMP_HEIGHT
    runnerRuntime.y = jumpY
    runnerRuntime.sliding = slideTime.current > 0.02

    if (jumpTime.current <= 0.02 && activeMotion.current === 'jump') {
      playMotion(actions.Running, 'run', currentAction, activeMotion, {
        loop: THREE.LoopRepeat,
        fade: 0.16,
        timeScale: 1.18
      })
    }

    const group = groupRef.current
    if (!group) return

    group.position.x = nextX
    group.position.y = 0.95 + jumpY
    group.position.z = 0
    group.rotation.z = THREE.MathUtils.damp(group.rotation.z, (targetX - nextX) * -0.08, 10, delta)

    const targetSquash = runnerRuntime.sliding ? 0.56 : 1
    squash.current = THREE.MathUtils.damp(squash.current, targetSquash, 16, delta)
    group.scale.set(1, squash.current, 1)

    const rig = rigRef.current
    if (rig) {
      const slideTilt = runnerRuntime.sliding ? -0.72 : 0
      const airborneLean = jumpTime.current > 0.02 ? 0.18 : 0
      rig.rotation.x = THREE.MathUtils.damp(rig.rotation.x, slideTilt + airborneLean, 12, delta)
      rig.position.y = THREE.MathUtils.damp(rig.position.y, runnerRuntime.sliding ? -0.18 : 0, 14, delta)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0.95, 0]}>
      <group ref={rigRef} rotation={[0, Math.PI, 0]}>
        <primitive ref={modelRef} object={scene} scale={0.42} position={[0, -0.92, 0]} />
      </group>
    </group>
  )
})

function playMotion(
  next: THREE.AnimationAction | null | undefined,
  name: 'run' | 'jump' | 'slide',
  currentAction: React.MutableRefObject<THREE.AnimationAction | null>,
  activeMotion: React.MutableRefObject<'run' | 'jump' | 'slide'>,
  options: { loop: THREE.AnimationActionLoopStyles; fade: number; timeScale: number }
) {
  if (!next || activeMotion.current === name) return

  const previous = currentAction.current
  next.enabled = true
  next.reset()
  next.setLoop(options.loop, options.loop === THREE.LoopOnce ? 1 : Infinity)
  next.clampWhenFinished = options.loop === THREE.LoopOnce
  next.timeScale = options.timeScale

  if (previous && previous !== next) previous.fadeOut(options.fade)
  next.fadeIn(options.fade).play()

  currentAction.current = next
  activeMotion.current = name
}

useGLTF.preload(ASSET_MANIFEST.models.player)
