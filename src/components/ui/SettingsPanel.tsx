import { memo } from 'react'
import { Button } from '@/components/ui/Button'
import { useSettingsStore } from '@/stores/settingsStore'
import type { QualityTier } from '@/types/game'

interface SettingsPanelProps {
  compact?: boolean
}

export const SettingsPanel = memo(function SettingsPanel({ compact = false }: SettingsPanelProps) {
  const quality = useSettingsStore((s) => s.quality)
  const bgmVolume = useSettingsStore((s) => s.bgmVolume)
  const sfxVolume = useSettingsStore((s) => s.sfxVolume)
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled)
  const setQuality = useSettingsStore((s) => s.setQuality)
  const setBgmVolume = useSettingsStore((s) => s.setBgmVolume)
  const setSfxVolume = useSettingsStore((s) => s.setSfxVolume)
  const setHapticsEnabled = useSettingsStore((s) => s.setHapticsEnabled)
  const tiers: QualityTier[] = ['low', 'mid', 'high']

  return (
    <section
      aria-label="settings"
      style={{
        width: compact ? 'min(320px, 92vw)' : 'min(420px, 92vw)',
        display: 'grid',
        gap: 14,
        padding: 16,
        borderRadius: 8,
        background: 'rgba(8,10,16,0.72)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ fontSize: 13, opacity: 0.72, textAlign: 'left' }}>画质</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {tiers.map((tier) => (
            <Button
              key={tier}
              variant={quality === tier ? 'primary' : 'ghost'}
              style={{ minWidth: 0, padding: '8px 10px', fontSize: 13 }}
              onClick={() => setQuality(tier)}
            >
              {tier.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <VolumeSlider label="音乐" value={bgmVolume} onChange={setBgmVolume} />
      <VolumeSlider label="音效" value={sfxVolume} onChange={setSfxVolume} />

      <label
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
          fontSize: 13
        }}
      >
        <span style={{ opacity: 0.72 }}>震动反馈</span>
        <input
          type="checkbox"
          checked={hapticsEnabled}
          onChange={(event) => setHapticsEnabled(event.currentTarget.checked)}
        />
      </label>
    </section>
  )
})

function VolumeSlider({
  label,
  value,
  onChange
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label style={{ display: 'grid', gridTemplateColumns: '48px 1fr 36px', gap: 10, alignItems: 'center' }}>
      <span style={{ fontSize: 13, opacity: 0.72, textAlign: 'left' }}>{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        style={{ width: '100%' }}
      />
      <span style={{ fontSize: 12, opacity: 0.72, textAlign: 'right' }}>{Math.round(value * 100)}</span>
    </label>
  )
}
