import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/stores/uiStore'
import { useGameStore } from '@/stores/gameStore'
import { audioManager } from '@/audio/audioManager'
import { CURRENT_GAME_DEFINITION } from '@/game-definitions/current'
import { resetRuntimePrefabs } from '@/prefabs/resetRuntime'
import { SettingsPanel } from '@/components/ui/SettingsPanel'

/**
 * DOM menu overlay. Lets the player start the game and pick a quality tier.
 */
export function MenuScene() {
  const goToScene = useUIStore((s) => s.goToScene)
  const reset = useGameStore((s) => s.reset)
  const setStatus = useGameStore((s) => s.setStatus)

  const start = () => {
    reset()
    resetRuntimePrefabs()
    setStatus('playing')
    audioManager.playBGM('bgm')
    goToScene('game')
  }

  return (
    <section className="overlay">
      <h1 className="title">{CURRENT_GAME_DEFINITION.ui.title}</h1>
      <p className="subtitle">{CURRENT_GAME_DEFINITION.ui.subtitle}</p>

      <Button onClick={start}>{CURRENT_GAME_DEFINITION.ui.startLabel}</Button>
      <SettingsPanel />
    </section>
  )
}
