import { create } from 'zustand'
import type { SceneName } from '@/types/game'

interface UIState {
  currentScene: SceneName
  paused: boolean
  hudVisible: boolean
  menuVisible: boolean

  goToScene: (name: SceneName) => void
  pause: () => void
  resume: () => void
  togglePause: () => void
  setHudVisible: (v: boolean) => void
}

/**
 * UI / flow state. Drives which scene the Router renders and the DOM overlays.
 * Components should subscribe with a selector, e.g. useUIStore(s => s.paused).
 */
export const useUIStore = create<UIState>((set, get) => ({
  currentScene: 'loading',
  paused: false,
  hudVisible: false,
  menuVisible: false,

  goToScene: (name) =>
    set({
      currentScene: name,
      hudVisible: name === 'game',
      menuVisible: name === 'menu',
      // resume when entering the actual game scene
      paused: name === 'game' ? false : get().paused
    }),

  pause: () => set({ paused: true }),
  resume: () => set({ paused: false }),
  togglePause: () => set({ paused: !get().paused }),

  setHudVisible: (v) => set({ hudVisible: v })
}))
