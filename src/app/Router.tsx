import { Suspense } from 'react'
import { useUIStore } from '@/stores/uiStore'
import { GameScene } from '@/scenes/GameScene'

/**
 * In-Canvas scene router.
 *
 * Only 3D scenes belong here. DOM scenes (loading / menu / game-over) are
 * rendered in the UI layer by <App>. When `currentScene` changes away from
 * 'game', the GameScene unmounts and R3F automatically disposes its resources.
 */
export function Router() {
  const currentScene = useUIStore((s) => s.currentScene)

  if (currentScene !== 'game') return null

  return (
    <Suspense fallback={null}>
      <GameScene />
    </Suspense>
  )
}
