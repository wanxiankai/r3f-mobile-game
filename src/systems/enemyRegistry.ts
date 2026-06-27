import * as THREE from 'three'
import { RuntimeCollection } from '@/core/runtimeCollection'

export interface EnemyRuntime {
  id: string
  position: THREE.Vector3
  velocity: THREE.Vector3
  hp: number
  alive: boolean
}

export const enemyRegistry = new RuntimeCollection<EnemyRuntime>()
