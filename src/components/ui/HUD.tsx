import { memo } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

/**
 * Heads-up display (pure DOM, never enters the Canvas).
 * Subscribes to gameStore with selectors so only score/lives changes re-render.
 * Wrapped in React.memo for cheap parent re-renders.
 */
export const HUD = memo(function HUD() {
  const score = useGameStore((s) => s.score)
  const lives = useGameStore((s) => s.lives)
  const togglePause = useUIStore((s) => s.togglePause)
  const paused = useUIStore((s) => s.paused)

  return (
    <header
      style={{
        position: 'absolute',
        top: 'calc(12px + var(--safe-top))',
        left: 'calc(16px + var(--safe-left))',
        right: 'calc(16px + var(--safe-right))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 700
      }}
    >
      <div style={{ fontSize: 20 }}>分数 {score}</div>
      <div aria-label="lives" style={{ fontSize: 20, color: 'var(--color-danger)' }}>
        {'\u2665'.repeat(Math.max(0, lives))}
      </div>
      <button
        onClick={togglePause}
        aria-label={paused ? 'resume' : 'pause'}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.1)',
          color: 'var(--color-fg)',
          fontSize: 16
        }}
      >
        {paused ? '\u25B6' : '\u2389'}
      </button>
    </header>
  )
})
