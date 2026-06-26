import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { setupLoaders, getKTX2Loader } from '@/loaders/gltfLoader'

/**
 * Initializes Draco / KTX2 / Meshopt decoders for drei's useGLTF once the
 * WebGLRenderer exists. Must live INSIDE the Canvas so useThree has `gl`.
 * Renders nothing.
 */
export function LoaderSetup() {
  const gl = useThree((s) => s.gl)

  useEffect(() => {
    // KTX2 needs the renderer to detect supported transcode targets.
    getKTX2Loader(gl)
    setupLoaders(gl)
  }, [gl])

  return null
}
