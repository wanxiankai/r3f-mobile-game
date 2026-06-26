import { Detailed } from '@react-three/drei'
import type { ReactNode } from 'react'

interface LODModelProps {
  /** Camera distances at which each child level becomes active (ascending). */
  distances: number[]
  /** Children ordered from highest detail (near) to lowest (far). */
  children: ReactNode[]
}

/**
 * Thin wrapper over drei's <Detailed> for level-of-detail switching.
 *
 * Usage:
 *   <LODModel distances={[0, 15, 40]}>
 *     <HighDetailMesh />
 *     <MidDetailMesh />
 *     <LowDetailMesh />
 *   </LODModel>
 */
export function LODModel({ distances, children }: LODModelProps) {
  return <Detailed distances={distances}>{children}</Detailed>
}
