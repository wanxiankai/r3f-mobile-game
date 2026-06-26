import { useEffect, useState } from 'react'
import { LoadingBar } from '@/components/ui/LoadingBar'
import { eventBus } from '@/utils/eventBus'
import { preloadAll } from '@/loaders/preloadAssets'
import { useUIStore } from '@/stores/uiStore'

/**
 * DOM loading overlay. Subscribes to eventBus 'asset:progress', runs the
 * preloader, then transitions to the menu scene.
 *
 * NOTE: This is a DOM-only scene rendered in the UI layer (App decides when),
 * NOT inside the R3F Canvas.
 */
export function LoadingScene() {
  const [progress, setProgress] = useState(0)
  const goToScene = useUIStore((s) => s.goToScene)

  useEffect(() => {
    const onProgress = (p: number) => setProgress(p)
    eventBus.on('asset:progress', onProgress)

    let done = false
    preloadAll().finally(() => {
      if (done) return
      done = true
      setProgress(1)
      // Small delay so the user sees 100%.
      setTimeout(() => goToScene('menu'), 350)
    })

    return () => {
      eventBus.off('asset:progress', onProgress)
    }
  }, [goToScene])

  return (
    <section className="overlay" aria-busy="true">
      <h1 className="title">R3F MOBILE GAME</h1>
      <p className="subtitle">加载资源中…</p>
      <LoadingBar progress={progress} />
    </section>
  )
}
