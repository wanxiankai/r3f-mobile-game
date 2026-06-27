export type HapticPattern = 'tap' | 'success' | 'warning'

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 12,
  success: [10, 30, 18],
  warning: [24, 30, 24]
}

class HapticsManager {
  private enabled = true

  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  pulse(pattern: HapticPattern = 'tap'): void {
    if (!this.enabled || typeof navigator === 'undefined' || !navigator.vibrate) return
    navigator.vibrate(PATTERNS[pattern])
  }
}

export const hapticsManager = new HapticsManager()
