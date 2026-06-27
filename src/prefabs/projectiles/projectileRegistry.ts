import * as THREE from 'three'
import { RuntimeCollection } from '@/core/runtimeCollection'

export interface ProjectileRuntime {
  id: string
  alive: boolean
  position: THREE.Vector3
  direction: THREE.Vector3
  speed: number
  radius: number
  life: number
  maxLife: number
  damage: number
}

export const projectileRegistry = new RuntimeCollection<ProjectileRuntime>()
