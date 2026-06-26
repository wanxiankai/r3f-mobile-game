import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/stores/uiStore'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { audioManager } from '@/audio/audioManager'
import type { QualityTier } from '@/types/game'

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
      <h1 className="title">主菜单</h1>
      <p className="subtitle">触摸左侧摇杆移动，右侧按钮跳跃 / 开火</p>

      <Button onClick={start}>开始游戏</Button>

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
