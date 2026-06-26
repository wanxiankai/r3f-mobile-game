import { useCallback, useRef } from 'react'
import { useInputStore } from '@/stores/inputStore'
import { clamp } from '@/utils/mathUtil'
import type { InputVector } from '@/types/game'

interface TouchHandlers {
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  knob: React.RefObject<HTMLDivElement>
}

/**
 * Virtual-joystick touch logic shared by VirtualJoystick.
 * Computes a normalized vector and writes it to inputStore (no subscription).
 *
 * @param radius max knob travel in px
 */
export function useTouch(radius = 56): TouchHandlers {
  const origin = useRef<{ x: number; y: number } | null>(null)
  const pointerId = useRef<number | null>(null)
  const knob = useRef<HTMLDivElement>(null)

  const setKnob = useCallback((dx: number, dy: number) => {
    if (knob.current) {
      knob.current.style.transform = `translate(${dx}px, ${dy}px)`
    }
  }, [])

  const emit = useCallback((v: InputVector) => {
    useInputStore.getState().setMove(v)
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      pointerId.current = e.pointerId
      origin.current = { x: e.clientX, y: e.clientY }
    },
    []
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (pointerId.current !== e.pointerId || !origin.current) return
      let dx = e.clientX - origin.current.x
      let dy = e.clientY - origin.current.y
      const dist = Math.hypot(dx, dy)
      if (dist > radius) {
        dx = (dx / dist) * radius
        dy = (dy / dist) * radius
      }
      setKnob(dx, dy)
      // Screen y-down -> game forward is -y, so invert.
      emit({ x: clamp(dx / radius, -1, 1), y: clamp(-dy / radius, -1, 1) })
    },
    [radius, setKnob, emit]
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (pointerId.current !== e.pointerId) return
      pointerId.current = null
      origin.current = null
      setKnob(0, 0)
      emit({ x: 0, y: 0 })
    },
    [setKnob, emit]
  )

  return { onPointerDown, onPointerMove, onPointerUp, knob }
}
