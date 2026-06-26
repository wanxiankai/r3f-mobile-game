import { EffectComposer, SMAA, Bloom } from '@react-three/postprocessing'
import { useSettingsStore } from '@/stores/settingsStore'

/**
 * Mobile-friendly post-processing.
 * - Always uses SMAA (cheaper than MSAA when antialias is off on the GL context;
 *   acts as our FXAA-equivalent edge AA).
 * - Bloom only on the 'high' tier.
 *
 * Render conditionally from scenes: {quality !== 'low' && <Postprocess />}
 */
export function Postprocess() {
  const quality = useSettingsStore((s) => s.quality)

  // Low tier should never mount this at all, but guard anyway.
  if (quality === 'low') return null

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <SMAA />
      {quality === 'high' ? (
        <Bloom intensity={0.4} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
      ) : (
        <></>
      )}
    </EffectComposer>
  )
}
