import { Environment as DreiEnvironment } from '@react-three/drei'
import { useSettingsStore } from '@/stores/settingsStore'

/**
 * Image-based lighting environment.
 * - low/mid: cheap built-in preset (no network fetch).
 * - high: could load a real .hdr/.ktx2 from the manifest (see TODO).
 */
export function Environment() {
  const quality = useSettingsStore((s) => s.quality)

  // TODO: 高端机替换为真实环境贴图 (assets/envmaps/studio.hdr)
  // <DreiEnvironment files={ASSET_MANIFEST.envmaps.studio} />
  if (quality === 'high') {
    return <DreiEnvironment preset="city" background={false} />
  }

  return <DreiEnvironment preset="apartment" background={false} />
}
