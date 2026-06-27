import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/stores/uiStore'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { audioManager } from '@/audio/audioManager'
import type { QualityTier } from '@/types/game'
import { CURRENT_GAME_DEFINITION } from '@/game-definitions/current'

/**
 * DOM menu overlay. Lets the player start the game and pick a quality tier.
 */
export function MenuScene() {
  const goToScene = useUIStore((s) => s.goToScene)
  const reset = useGameStore((s) => s.reset)
  const setStatus = useGameStore((s) => s.setStatus)
  const quality = useSettingsStore((s) => s.quality)
  const setQuality = useSettingsStore((s) => s.setQuality)

  const start = () => {
    reset()
    setStatus('playing')
    audioManager.playBGM('bgm')
    goToScene('game')
  }

  const tiers: QualityTier[] = ['low', 'mid', 'high']

  return (
    <section className="overlay">
      <h1 className="title">{CURRENT_GAME_DEFINITION.ui.title}</h1>
      <p className="subtitle">{CURRENT_GAME_DEFINITION.ui.subtitle}</p>

      <Button onClick={start}>{CURRENT_GAME_DEFINITION.ui.startLabel}</Button>

      <fieldset
        style={{
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}
      >
        <legend style={{ padding: '0 8px', opacity: 0.7, fontSize: 13 }}>画质</legend>
        {tiers.map((t) => (
          <Button
            key={t}
            variant={quality === t ? 'primary' : 'ghost'}
            style={{ minWidth: 72, padding: '8px 12px', fontSize: 14 }}
            onClick={() => setQuality(t)}
          >
            {t.toUpperCase()}
          </Button>
        ))}
      </fieldset>
    </section>
  )
}
