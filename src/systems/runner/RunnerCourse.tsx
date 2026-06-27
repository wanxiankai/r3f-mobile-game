import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import {
  RUNNER_LANES,
  resetRunnerRuntime,
  runnerRuntime,
  type RunnerObstacleKind
} from '@/systems/runner/runnerRuntime'
import { hapticsManager } from '@/utils/haptics'

interface RunnerObstacle {
  z: number
  lane: number
  kind: RunnerObstacleKind
  hit: boolean
}

interface RunnerCoin {
  z: number
  lane: number
  collected: boolean
}

const ROAD_SEGMENTS = 9
const OBSTACLE_COUNT = 28
const COIN_COUNT = 72
const ROAD_LENGTH = 18
const RECYCLE_Z = -12

const obstacleKinds: RunnerObstacleKind[] = ['barrier', 'arch', 'blocker']

function nextObstacle(index: number, z: number): RunnerObstacle {
  return {
    z,
    lane: (index * 5 + Math.floor(z)) % RUNNER_LANES.length,
    kind: obstacleKinds[index % obstacleKinds.length],
    hit: false
  }
}

function nextCoin(index: number, z: number): RunnerCoin {
  return {
    z,
    lane: (index + Math.floor(z / 9)) % RUNNER_LANES.length,
    collected: false
  }
}

export function RunnerCourse() {
  const roadRef = useRef<THREE.InstancedMesh>(null)
  const obstacleRef = useRef<THREE.InstancedMesh>(null)
  const coinRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const scoreTimer = useRef(0)
  const milestone = useRef(1)

  const roadSegments = useRef(
    Array.from({ length: ROAD_SEGMENTS }, (_, i) => ({ z: i * ROAD_LENGTH - 16 }))
  )
  const obstacles = useRef(
    Array.from({ length: OBSTACLE_COUNT }, (_, i) => nextObstacle(i, 58 + i * 14))
  )
  const coins = useRef(Array.from({ length: COIN_COUNT }, (_, i) => nextCoin(i, 11 + i * 3.1)))

  useEffect(() => {
    resetRunnerRuntime()
  }, [])

  useFrame((_, delta) => {
    if (useUIStore.getState().paused || useGameStore.getState().status !== 'playing') return

    runnerRuntime.distance += runnerRuntime.speed * delta
    runnerRuntime.speed = Math.min(27, 13 + runnerRuntime.distance * 0.018)

    scoreTimer.current += delta
    if (scoreTimer.current > 0.28) {
      scoreTimer.current = 0
      useGameStore.getState().addScore(Math.round(runnerRuntime.speed))
    }

    const targetLevel = Math.floor(runnerRuntime.distance / 260) + 1
    if (targetLevel > milestone.current) {
      milestone.current = targetLevel
      useGameStore.getState().nextLevel()
    }

    const dz = runnerRuntime.speed * delta
    const farRoad = Math.max(...roadSegments.current.map((segment) => segment.z))
    roadSegments.current.forEach((segment, index) => {
      segment.z -= dz
      if (segment.z < RECYCLE_Z) segment.z = farRoad + ROAD_LENGTH

      dummy.position.set(0, -0.08, segment.z)
      dummy.scale.set(1, 1, 1)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      roadRef.current?.setMatrixAt(index, dummy.matrix)
    })
    if (roadRef.current) roadRef.current.instanceMatrix.needsUpdate = true

    let farObstacle = Math.max(...obstacles.current.map((obstacle) => obstacle.z))
    obstacles.current.forEach((obstacle, index) => {
      obstacle.z -= dz
      if (obstacle.z < RECYCLE_Z) {
        const next = nextObstacle(index + Math.floor(runnerRuntime.distance), farObstacle + 7 + (index % 4))
        obstacle.z = next.z
        obstacle.lane = next.lane
        obstacle.kind = next.kind
        obstacle.hit = false
        farObstacle = obstacle.z
      }

      const sameLane = obstacle.lane === runnerRuntime.lane
      const inPlayerZone = obstacle.z > -0.55 && obstacle.z < 0.42
      const clearsBarrier = obstacle.kind === 'barrier' && runnerRuntime.y > 1.05
      const clearsArch = obstacle.kind === 'arch' && runnerRuntime.sliding
      const clearsBlocker = obstacle.kind === 'blocker' && runnerRuntime.y > 2.15

      if (
        sameLane &&
        inPlayerZone &&
        !obstacle.hit &&
        !clearsBarrier &&
        !clearsArch &&
        !clearsBlocker &&
        performance.now() > runnerRuntime.invulnerableUntil
      ) {
        obstacle.hit = true
        runnerRuntime.invulnerableUntil = performance.now() + 1500
        hapticsManager.pulse('warning')
        useGameStore.getState().loseLife()
      }

      dummy.position.set(RUNNER_LANES[obstacle.lane], obstacle.kind === 'arch' ? 1.45 : 0.55, obstacle.z)
      dummy.rotation.set(0, obstacle.kind === 'blocker' ? Math.PI / 4 : 0, 0)
      const width = obstacle.kind === 'arch' ? 1.48 : 1.15
      const height = obstacle.kind === 'arch' ? 0.5 : obstacle.kind === 'barrier' ? 0.95 : 1.5
      dummy.scale.set(width, height, 0.82)
      dummy.updateMatrix()
      obstacleRef.current?.setMatrixAt(index, dummy.matrix)
    })
    if (obstacleRef.current) obstacleRef.current.instanceMatrix.needsUpdate = true

    let farCoin = Math.max(...coins.current.map((coin) => coin.z))
    coins.current.forEach((coin, index) => {
      coin.z -= dz
      if (coin.z < RECYCLE_Z || coin.collected) {
        const next = nextCoin(index + Math.floor(runnerRuntime.distance), farCoin + 2.7)
        coin.z = next.z
        coin.lane = next.lane
        coin.collected = false
        farCoin = coin.z
      }

      const sameLane = coin.lane === runnerRuntime.lane
      if (sameLane && Math.abs(coin.z) < 0.85 && runnerRuntime.y < 2.4 && !coin.collected) {
        coin.collected = true
        hapticsManager.pulse('tap')
        useGameStore.getState().addScore(25)
      }

      dummy.position.set(RUNNER_LANES[coin.lane], 1.05 + Math.sin((runnerRuntime.distance + index) * 0.08) * 0.12, coin.z)
      dummy.rotation.set(Math.PI / 2, 0, runnerRuntime.distance * 0.08 + index)
      dummy.scale.setScalar(coin.collected ? 0.001 : 1)
      dummy.updateMatrix()
      coinRef.current?.setMatrixAt(index, dummy.matrix)
    })
    if (coinRef.current) coinRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={roadRef} args={[undefined, undefined, ROAD_SEGMENTS]} receiveShadow>
        <boxGeometry args={[9.2, 0.16, ROAD_LENGTH - 0.35]} />
        <meshStandardMaterial color="#233247" roughness={0.7} />
      </instancedMesh>

      <instancedMesh ref={obstacleRef} args={[undefined, undefined, OBSTACLE_COUNT]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff5d73" roughness={0.42} metalness={0.08} />
      </instancedMesh>

      <instancedMesh ref={coinRef} args={[undefined, undefined, COIN_COUNT]} castShadow>
        <torusGeometry args={[0.34, 0.085, 10, 20]} />
        <meshStandardMaterial color="#ffd166" emissive="#b17400" emissiveIntensity={0.32} roughness={0.26} metalness={0.35} />
      </instancedMesh>

      <LaneMarkers />
      <CitySilhouette />
    </>
  )
}

function LaneMarkers() {
  return (
    <group>
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} position={[x, 0.025, 28]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 110]} />
          <meshBasicMaterial color="#7bdff2" transparent opacity={0.38} />
        </mesh>
      ))}
    </group>
  )
}

function CitySilhouette() {
  return (
    <group position={[0, 0, 28]}>
      {Array.from({ length: 24 }, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1
        const x = side * (6.8 + (i % 4) * 1.1)
        const z = -24 + i * 4.5
        const h = 2.4 + ((i * 7) % 9) * 0.42
        return (
          <mesh key={i} position={[x, h / 2 - 0.08, z]} receiveShadow>
            <boxGeometry args={[1.2 + (i % 3) * 0.36, h, 1.2]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#354760' : '#28384f'} roughness={0.78} />
          </mesh>
        )
      })}
    </group>
  )
}
