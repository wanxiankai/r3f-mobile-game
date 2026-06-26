import { useEffect } from 'react'
import { audioManager } from '@/audio/audioManager'
import type { AudioKey } from '@/loaders/assetManifest'

/**
 * Thin React wrapper around the audioManager singleton.
 * Initializes the manager once and returns play helpers.
 */
export function useAudio() {
  useEffect(() => {
    audioManager.init()
  }, [])

  return {
    playBGM: (key?: AudioKey) => audioManager.playBGM(key),
    stopBGM: () => audioManager.stopBGM(),
    playSFX: (key: AudioKey) => audioManager.playSFX(key),
    stopAll: () => audioManager.stopAll()
  }
}
