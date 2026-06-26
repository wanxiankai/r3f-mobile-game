import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import { audioManager } from '@/audio/audioManager'

/**
 * DOM game-over overlay. Shows final score and offers retry / menu.
 */
export function GameOverScene() {
  const score = useGameStore((s) => s.score)
  const reset = useGameStore((s) => s.reset)
  const setStatus = useGameStore((s) => s.setStatus)
  const goToScene = useUIStore((s) => s.goToScene)

  const retry = () => {
    reset()
    setStatus('playing')
    audioManager.playBGM('bgm')
    goToScene('game')
  }

  const toMenu = () => {
    reset()
    audioManager.stopBGM()
    goToScene('menu')
  }

  return (
    <section className="overlay">
      <h1 className="title">游戏结束</h1>
      <p className="subtitle">最终分数：{score}</p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button onClick={retry}>再来一局</Button>
        <Button variant="ghost" onClick={toMenu}>
          返回菜单
        </Button>
      </div>
    </section>
  )
}
