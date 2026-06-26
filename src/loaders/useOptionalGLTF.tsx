import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

const assetAvailability = new Map<string, boolean>()

function isHtmlFallback(response: Response): boolean {
  return response.headers.get('content-type')?.includes('text/html') ?? false
}

export function useOptionalAsset(url: string): boolean {
  const [available, setAvailable] = useState(() => assetAvailability.get(url) ?? false)

  useEffect(() => {
    const cached = assetAvailability.get(url)
    if (cached !== undefined) {
      setAvailable(cached)
      return
    }

    let cancelled = false

    fetch(url, { method: 'HEAD' })
      .then((response) => response.ok && !isHtmlFallback(response))
      .catch(() => false)
      .then((exists) => {
        assetAvailability.set(url, exists)
        if (!cancelled) setAvailable(exists)
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return available
}

interface OptionalGLTFModelProps {
  url: string
  clone?: boolean
}

export function OptionalGLTFModel({ url, clone = false }: OptionalGLTFModelProps) {
  const gltf = useGLTF(url) as unknown as { scene?: THREE.Group }
  const scene = gltf.scene
  const object = useMemo(() => {
    if (!scene) return null
    return clone ? scene.clone(true) : scene
  }, [clone, scene])

  return object ? <primitive object={object} /> : null
}
