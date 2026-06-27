import { useInputStore } from '@/stores/inputStore'
import { useTouch } from '@/hooks/useTouch'
import { CURRENT_GAME_DEFINITION } from '@/game-definitions/current'
import { getTouchBinding } from '@/core/actionMap'
import { hapticsManager } from '@/utils/haptics'

const RADIUS = 56

/**
 * Pure DOM virtual joystick. Writes the normalized vector into inputStore
 * (setter only — no subscription). The fire button queues firing/jump.
 */
export function VirtualJoystick() {
  const { onPointerDown, onPointerMove, onPointerUp, knob } = useTouch(RADIUS)
  const actionButton = getTouchBinding(CURRENT_GAME_DEFINITION.actions, 'right-button')
  const actionLabel = actionButton?.touch?.label ?? 'A'

  return (
    <>
      {/* Movement joystick (bottom-left) */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position: 'absolute',
          left: 'calc(28px + var(--safe-left))',
          bottom: 'calc(36px + var(--safe-bottom))',
          width: RADIUS * 2 + 32,
          height: RADIUS * 2 + 32,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: '2px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none'
        }}
      >
        <div
          ref={knob}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(76,201,240,0.7)',
            willChange: 'transform',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Fire / jump button (bottom-right) */}
      <button
        onPointerDown={() => {
          hapticsManager.pulse('tap')
          useInputStore.getState().setFiring(true)
          useInputStore.getState().setAction('fire', true)
          useInputStore.getState().queueJump()
        }}
        onPointerUp={() => {
          useInputStore.getState().setFiring(false)
          useInputStore.getState().setAction('fire', false)
        }}
        onPointerCancel={() => {
          useInputStore.getState().setFiring(false)
          useInputStore.getState().setAction('fire', false)
        }}
        aria-label="action"
        style={{
          position: 'absolute',
          right: 'calc(36px + var(--safe-right))',
          bottom: 'calc(48px + var(--safe-bottom))',
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: 'rgba(239,71,111,0.75)',
          color: '#fff',
          fontSize: 20,
          fontWeight: 800,
          touchAction: 'none'
        }}
      >
        {actionLabel}
      </button>
    </>
  )
}
