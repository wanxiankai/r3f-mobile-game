interface LoadingBarProps {
  /** 0..1 */
  progress: number
}

/**
 * Pure DOM loading bar (outside the Canvas). Driven by parent state which
 * subscribes to the eventBus 'asset:progress' events.
 */
export function LoadingBar({ progress }: LoadingBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100)
  return (
    <div style={{ width: 'min(72vw, 360px)' }}>
      <div
        style={{
          width: '100%',
          height: 8,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'var(--color-accent)',
            transition: 'width 0.2s ease'
          }}
        />
      </div>
      <div style={{ marginTop: 12, fontSize: 14, opacity: 0.7 }}>{pct}%</div>
    </div>
  )
}
