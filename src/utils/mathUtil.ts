import * as THREE from 'three'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Framerate-independent damping factor for smoothing (delta in seconds). */
export function damp(current: number, target: number, lambda: number, delta: number): number {
  return THREE.MathUtils.damp(current, target, lambda, delta)
}

export function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function randInt(min: number, max: number): number {
  return Math.floor(randRange(min, max + 1))
}

/** Return a random point on a circle of given radius on the XZ plane. */
export function randomPointOnCircleXZ(radius: number): THREE.Vector3 {
  const angle = Math.random() * Math.PI * 2
  return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
}

export function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}
