import { useSettingsStore } from '@/stores/settingsStore'
import { getPreset } from '@/rendering/qualityPreset'

/**
 * Minimal lighting: ambient + one directional.
 * Shadows are toggled by quality tier; shadow map capped at 1024.
 */
export function Lights() {
  const quality = useSettingsStore((s) => s.quality)
  const preset = getPreset(quality)

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.1}
        castShadow={preset.shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  )
}
