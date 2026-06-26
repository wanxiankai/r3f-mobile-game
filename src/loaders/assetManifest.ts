/**
 * Single source of truth for all asset paths.
 * Never hardcode asset paths elsewhere — reference this manifest.
 *
 * NOTE: These files are placeholders for now (see .gitkeep dirs).
 * Loaders gracefully fall back to primitive geometry when a model is missing.
 */
export const ASSET_MANIFEST = {
  models: {
    player: '/assets/models/player.glb',
    enemy: '/assets/models/enemy.glb'
  },
  textures: {
    ground: '/assets/textures/ground.ktx2'
  },
  envmaps: {
    studio: '/assets/envmaps/studio.hdr'
  },
  audio: {
    bgm: '/assets/audio/bgm.mp3',
    shoot: '/assets/audio/shoot.mp3',
    hit: '/assets/audio/hit.mp3'
  }
} as const

export type AssetManifest = typeof ASSET_MANIFEST
export type ModelKey = keyof AssetManifest['models']
export type TextureKey = keyof AssetManifest['textures']
export type AudioKey = keyof AssetManifest['audio']
