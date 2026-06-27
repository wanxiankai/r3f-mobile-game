import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import { eventBus } from '@/utils/eventBus'
import { CURRENT_GAME_DEFINITION } from '@/game-definitions/current'
import { getPreloadUrls, type AssetPack } from '@/core/assetPacks'

let progressBound = false

/**
 * Hook THREE.DefaultLoadingManager progress into the event bus so the
 * LoadingScene can render a progress bar without subscribing to loaders.
 */
function bindProgress(): void {
  if (progressBound) return
  progressBound = true

  THREE.DefaultLoadingManager.onProgress = (_url, loaded, total) => {
    const ratio = total > 0 ? loaded / total : 0
    eventBus.emit('asset:progress', ratio)
  }
  THREE.DefaultLoadingManager.onLoad = () => {
    eventBus.emit('asset:progress', 1)
    eventBus.emit('asset:complete')
  }
  THREE.DefaultLoadingManager.onError = (url) => {
    eventBus.emit('asset:error', url)
  }
}

/**
 * Preload all declared assets. Failures are swallowed (placeholders are used),
 * but progress is still reported so the bar always completes.
 */
export async function preloadAll(
  packs: AssetPack[] = CURRENT_GAME_DEFINITION.assetPacks
): Promise<void> {
  bindProgress()

  const tasks: Promise<unknown>[] = []
  const assets = getPreloadUrls(packs, ['boot', 'menu', 'gameplay'])

  for (const asset of assets.filter((entry) => entry.kind === 'model')) {
    tasks.push(
      Promise.resolve()
        .then(() => useGLTF.preload(asset.url))
        .catch(() => eventBus.emit('asset:error', asset.url))
    )
  }

  for (const asset of assets.filter((entry) => entry.kind === 'texture')) {
    tasks.push(
      Promise.resolve()
        .then(() => useTexture.preload(asset.url))
        .catch(() => eventBus.emit('asset:error', asset.url))
    )
  }

  await Promise.allSettled(tasks)

  // Guarantee the bar reaches 100% even if the manager fired no events
  // (e.g. all assets are placeholders that fail fast).
  eventBus.emit('asset:progress', 1)
  eventBus.emit('asset:complete')
}
