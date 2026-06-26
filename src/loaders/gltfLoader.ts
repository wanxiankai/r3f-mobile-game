import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { useGLTF } from '@react-three/drei'

export const DRACO_PATH = '/assets/draco/'
export const BASIS_PATH = '/assets/basis/'

let dracoLoaderSingleton: DRACOLoader | null = null
let ktx2LoaderSingleton: KTX2Loader | null = null

export function getDracoLoader(): DRACOLoader {
  if (!dracoLoaderSingleton) {
    dracoLoaderSingleton = new DRACOLoader()
    dracoLoaderSingleton.setDecoderPath(DRACO_PATH)
    dracoLoaderSingleton.setDecoderConfig({ type: 'js' })
  }
  return dracoLoaderSingleton
}

/**
 * KTX2Loader needs the renderer to detect supported transcoder formats.
 * Call once after the WebGLRenderer exists (see LoaderSetup in GameCanvas).
 */
export function getKTX2Loader(renderer?: THREE.WebGLRenderer): KTX2Loader {
  if (!ktx2LoaderSingleton) {
    ktx2LoaderSingleton = new KTX2Loader()
    ktx2LoaderSingleton.setTranscoderPath(BASIS_PATH)
  }
  if (renderer) {
    ktx2LoaderSingleton.detectSupport(renderer)
  }
  return ktx2LoaderSingleton
}

/**
 * Configured imperative GLTFLoader (Draco + KTX2 + Meshopt).
 * Use for command-style loading outside the R3F render tree.
 */
export function createGLTFLoader(renderer?: THREE.WebGLRenderer): GLTFLoader {
  const loader = new GLTFLoader()
  loader.setDRACOLoader(getDracoLoader())
  loader.setKTX2Loader(getKTX2Loader(renderer))
  loader.setMeshoptDecoder(MeshoptDecoder)
  return loader
}

/**
 * Inject Draco + KTX2 + Meshopt decoders into drei's useGLTF loader.
 * Call BEFORE any useGLTF / useGLTF.preload runs (do it in LoaderSetup).
 */
export function setupLoaders(renderer?: THREE.WebGLRenderer): void {
  const draco = getDracoLoader()
  const ktx2 = getKTX2Loader(renderer)

  useGLTF.setDecoderPath(DRACO_PATH)

  // drei exposes the underlying loader via the (loader) callback form.
  // We extend each GLTFLoader instance it creates.
  // The cast keeps us strict while accessing drei's internal API surface.
  type ExtendArg = (extendLoader: (loader: GLTFLoader) => void) => void
  const preload = useGLTF.preload as unknown as { extend?: ExtendArg }
  if (typeof preload.extend === 'function') {
    preload.extend((loader: GLTFLoader) => {
      loader.setDRACOLoader(draco)
      loader.setKTX2Loader(ktx2)
      loader.setMeshoptDecoder(MeshoptDecoder)
    })
  }
}

/**
 * Stable, supported way to wire decoders for drei's useGLTF:
 * pass this callback as the 4th arg of useGLTF(url, true, true, extendLoader).
 */
export function extendGLTFLoader(renderer?: THREE.WebGLRenderer) {
  const draco = getDracoLoader()
  const ktx2 = getKTX2Loader(renderer)
  return (loader: GLTFLoader) => {
    loader.setDRACOLoader(draco)
    loader.setKTX2Loader(ktx2)
    loader.setMeshoptDecoder(MeshoptDecoder)
  }
}
