import type { AssetManifest } from '@/loaders/assetManifest'

export type AssetKind = 'model' | 'texture' | 'audio' | 'envmap' | 'image' | 'other'
export type AssetLoadPhase = 'boot' | 'menu' | 'gameplay' | 'lazy'

export interface AssetEntry {
  id: string
  url: string
  kind: AssetKind
  phase: AssetLoadPhase
  critical?: boolean
}

export interface AssetPack {
  id: string
  label: string
  assets: AssetEntry[]
}

export function createDefaultAssetPack(manifest: AssetManifest): AssetPack {
  return {
    id: 'default-gameplay',
    label: 'Default Gameplay Assets',
    assets: [
      ...Object.entries(manifest.models).map(([id, url]) => ({
        id: `model:${id}`,
        url,
        kind: 'model' as const,
        phase: 'gameplay' as const,
        critical: id === 'player'
      })),
      ...Object.entries(manifest.textures).map(([id, url]) => ({
        id: `texture:${id}`,
        url,
        kind: 'texture' as const,
        phase: 'gameplay' as const
      })),
      ...Object.entries(manifest.envmaps).map(([id, url]) => ({
        id: `envmap:${id}`,
        url,
        kind: 'envmap' as const,
        phase: 'gameplay' as const
      })),
      ...Object.entries(manifest.audio).map(([id, url]) => ({
        id: `audio:${id}`,
        url,
        kind: 'audio' as const,
        phase: id === 'bgm' ? ('menu' as const) : ('lazy' as const)
      }))
    ]
  }
}

export function getPreloadUrls(packs: AssetPack[], phases: AssetLoadPhase[]): AssetEntry[] {
  const allowed = new Set(phases)
  const seen = new Set<string>()
  const entries: AssetEntry[] = []

  for (const pack of packs) {
    for (const asset of pack.assets) {
      if (!allowed.has(asset.phase) || seen.has(asset.url)) continue
      seen.add(asset.url)
      entries.push(asset)
    }
  }

  return entries
}
