import { useEffect } from 'react'
import { GameCanvas } from '@/app/GameCanvas'
import { LoadingScene } from '@/scenes/LoadingScene'
import { MenuScene } from '@/scenes/MenuScene'
import { GameOverScene } from '@/scenes/GameOverScene'
import { HUD } from '@/components/ui/HUD'
import { VirtualJoystick } from '@/components/ui/VirtualJoystick'
import { useUIStore } from '@/stores/uiStore'
import { useGameStore } from '@/stores/gameStore'
import { useDeviceTier } from '@/hooks/useDeviceTier'
import { useAudio } from '@/hooks/useAudio'

/**
 * App root.
 * - Detects device tier (writes quality into settingsStore).
 * - Renders the persistent <GameCanvas> plus a DOM UI overlay.
 * - The DOM overlay shows the loading / menu / game-over scenes and the HUD.
 * - Pauses the game on tab/app background (visibilitychange).
 */
export default function App() {
  const currentScene = useUIStore((s) => s.currentScene)
  const hudVisible = useUIStore((s) => s.hudVisible)
  const paused = useUIStore((s) => s.paused)
  const status = useGameStore((s) => s.status)

  useDeviceTier()
  useAudio()

  // Pause when the page is hidden (battery + correctness).
  useEffect(() => {
    const onVisibility = () => {
      const ui = useUIStore.getState()
      if (document.hidden) ui.pause()
      else if (ui.currentScene === 'game') ui.resume()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Drive the game-over scene from game status.
  useEffect(() => {
    if (status === 'over') useUIStore.getState().goToScene('gameover')
  }, [status])

  return (
    <>
      {/* Persistent 3D canvas (handles its own in-Canvas scene routing). */}
      <GameCanvas />

      {/* DOM UI overlay layer */}
      <div className="ui-layer">
        {currentScene === 'loading' && <LoadingScene />}
        {currentScene === 'menu' && <MenuScene />}
        {currentScene === 'gameover' && <GameOverScene />}

        {currentScene === 'game' && hudVisible && (
          <>
            <HUD />
            <VirtualJoystick />
          </>
        )}

        {/* Simple pause veil while in-game */}
        {currentScene === 'game' && paused && (
          <section className="overlay" aria-live="polite">
            <h2 className="title">已暂停</h2>
            <p className="subtitle">点击右上角按钮继续</p>
          </section>
        )}
      </div>
    </>
  )
}
