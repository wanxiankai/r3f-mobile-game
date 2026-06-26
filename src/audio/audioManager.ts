import { Howl, Howler } from 'howler'
import { ASSET_MANIFEST, type AudioKey } from '@/loaders/assetManifest'
import { useSettingsStore } from '@/stores/settingsStore'

/**
 * Howler.js singleton audio manager.
 * - Lazily creates Howl instances from the manifest.
 * - Handles iOS audio unlock on first user gesture.
 * - Reacts to settingsStore volume changes.
 */
class AudioManager {
  private sounds = new Map<AudioKey, Howl>()
  private bgmKey: AudioKey | null = null
  private unlocked = false
  private disposeVolumeSub: (() => void) | null = null

  init(): void {
    if (this.disposeVolumeSub) return

    // Apply persisted volumes and keep them in sync.
    const apply = (bgm: number) => {
      if (this.bgmKey) this.sounds.get(this.bgmKey)?.volume(bgm)
    }
    apply(useSettingsStore.getState().bgmVolume)

    this.disposeVolumeSub = useSettingsStore.subscribe((state) => {
      if (this.bgmKey) this.sounds.get(this.bgmKey)?.volume(state.bgmVolume)
    })

    // iOS / Safari require a user gesture to unlock the audio context.
    const unlock = () => {
      if (this.unlocked) return
      this.unlocked = true
      // Resume Howler's underlying context if suspended.
      const ctx = Howler.ctx
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => undefined)
      }
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchend', unlock)
    }
    window.addEventListener('pointerdown', unlock, { once: false })
    window.addEventListener('touchend', unlock, { once: false })
  }

  private get(key: AudioKey, loop = false): Howl {
    let howl = this.sounds.get(key)
    if (!howl) {
      howl = new Howl({
        src: [ASSET_MANIFEST.audio[key]],
        loop,
        preload: true,
        html5: false
      })
      this.sounds.set(key, howl)
    }
    return howl
  }

  playBGM(key: AudioKey = 'bgm'): void {
    this.bgmKey = key
    const howl = this.get(key, true)
    howl.volume(useSettingsStore.getState().bgmVolume)
    if (!howl.playing()) howl.play()
  }

  stopBGM(): void {
    if (this.bgmKey) this.get(this.bgmKey, true).stop()
  }

  playSFX(key: AudioKey): void {
    const howl = this.get(key, false)
    howl.volume(useSettingsStore.getState().sfxVolume)
    howl.play()
  }

  setVolume(type: 'bgm' | 'sfx', value: number): void {
    if (type === 'bgm') useSettingsStore.getState().setBgmVolume(value)
    else useSettingsStore.getState().setSfxVolume(value)
  }

  stopAll(): void {
    Howler.stop()
  }

  dispose(): void {
    this.stopAll()
    this.sounds.forEach((h) => h.unload())
    this.sounds.clear()
    this.disposeVolumeSub?.()
    this.disposeVolumeSub = null
  }
}

export const audioManager = new AudioManager()
