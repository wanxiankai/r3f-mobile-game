import { create } from 'zustand'
import type { InputVector } from '@/types/game'

interface InputState {
  /** Normalized movement vector from joystick / keyboard, components in [-1, 1]. */
  move: InputVector
  /** Whether the fire action is currently held. */
  firing: boolean
  /** One-shot jump request flag (consumed by Player each frame). */
  jumpQueued: boolean
  /** Generic action states for template-level input mapping. */
  actions: Record<string, boolean>

  setMove: (v: InputVector) => void
  setFiring: (firing: boolean) => void
  setAction: (action: string, pressed: boolean) => void
  queueJump: () => void
  consumeJump: () => boolean
  resetInput: () => void
}

/**
 * Input state.
 *
 * IMPORTANT: per-frame consumers (useFrame) MUST read via getState():
 *   const { move } = useInputStore.getState()
 * Do NOT subscribe with a hook inside game-loop components — that triggers
 * React re-renders every frame. Only DOM input widgets call the setters.
 */
export const useInputStore = create<InputState>((set, get) => ({
  move: { x: 0, y: 0 },
  firing: false,
  jumpQueued: false,
  actions: {},

  setMove: (v) => set({ move: v }),
  setFiring: (firing) => set({ firing }),
  setAction: (action, pressed) =>
    set((state) => ({ actions: { ...state.actions, [action]: pressed } })),
  queueJump: () => set({ jumpQueued: true }),

  consumeJump: () => {
    if (get().jumpQueued) {
      set({ jumpQueued: false })
      return true
    }
    return false
  },

  resetInput: () => set({ move: { x: 0, y: 0 }, firing: false, jumpQueued: false, actions: {} })
}))

/** Convenience non-subscribing reader for game-loop code. */
export function getInput(): InputState {
  return useInputStore.getState()
}
