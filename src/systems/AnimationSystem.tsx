import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface AnimationSystemProps {
  /** Root object that owns the animated skinned meshes. */
  root: THREE.Object3D | null
  /** AnimationClips parsed from the GLTF. */
  clips: THREE.AnimationClip[]
  /** Name of the clip to play; falls back to first clip. */
  action?: string
}

/**
 * Lightweight AnimationMixer wrapper. Advances the mixer in useFrame
 * (no setState) and cross-fades when the requested action changes.
 */
export function AnimationSystem({ root, clips, action }: AnimationSystemProps) {
  const mixer = useMemo(() => (root ? new THREE.AnimationMixer(root) : null), [root])

  useEffect(() => {
    if (!mixer || clips.length === 0) return
    const clip = (action && THREE.AnimationClip.findByName(clips, action)) || clips[0]
    if (!clip) return
    const current = mixer.clipAction(clip)
    current.reset().fadeIn(0.2).play()
    return () => {
      current.fadeOut(0.2)
    }
  }, [mixer, clips, action])

  useEffect(() => {
    return () => {
      mixer?.stopAllAction()
    }
  }, [mixer])

  useFrame((_, delta) => {
    mixer?.update(delta)
  })

  return null
}
