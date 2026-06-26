import * as THREE from 'three'

function disposeMaterial(material: THREE.Material): void {
  // Dispose any texture-bearing uniforms / standard maps.
  const mat = material as unknown as Record<string, unknown>
  for (const key of Object.keys(mat)) {
    const value = mat[key]
    if (value && value instanceof THREE.Texture) {
      value.dispose()
    }
  }
  material.dispose()
}

/**
 * Recursively dispose geometry / materials / textures of an Object3D.
 *
 * NOTE: R3F automatically disposes objects it created when components unmount.
 * Use this ONLY for objects you created imperatively (e.g. particle systems,
 * pooled meshes, manual loaders).
 */
export function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }
    const material = (child as THREE.Mesh).material
    if (material) {
      if (Array.isArray(material)) {
        material.forEach(disposeMaterial)
      } else {
        disposeMaterial(material)
      }
    }
  })

  if (obj.parent) {
    obj.parent.remove(obj)
  }
}
