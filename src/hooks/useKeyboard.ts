import { useEffect } from 'react'
import { useInputStore } from '@/stores/inputStore'
import { CURRENT_GAME_DEFINITION } from '@/game-definitions/current'
import { findActionByKey } from '@/core/actionMap'

/**
 * Desktop keyboard input (WASD / arrows + space).
 * Writes into inputStore via setters — never subscribes per frame.
 * Useful for development on desktop; harmless on mobile.
 */
export function useKeyboard(): void {
  useEffect(() => {
    const pressed = new Set<string>()

    const apply = () => {
      const x = (pressed.has('d') || pressed.has('arrowright') ? 1 : 0) -
        (pressed.has('a') || pressed.has('arrowleft') ? 1 : 0)
      const y = (pressed.has('w') || pressed.has('arrowup') ? 1 : 0) -
        (pressed.has('s') || pressed.has('arrowdown') ? 1 : 0)
      // y maps to forward(+)/back(-); normalize diagonal
      const len = Math.hypot(x, y) || 1
      useInputStore.getState().setMove({ x: x / len, y: y / len })
    }

    const onDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const binding = findActionByKey(CURRENT_GAME_DEFINITION.actions, key)
      if (binding?.action === 'jump') {
        useInputStore.getState().queueJump()
        return
      }
      if (binding?.action === 'fire') {
        useInputStore.getState().setFiring(true)
        useInputStore.getState().setAction('fire', true)
        return
      }
      pressed.add(key)
      apply()
    }
    const onUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const binding = findActionByKey(CURRENT_GAME_DEFINITION.actions, key)
      if (binding?.action === 'fire') {
        useInputStore.getState().setFiring(false)
        useInputStore.getState().setAction('fire', false)
        return
      }
      pressed.delete(key)
      apply()
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])
}
