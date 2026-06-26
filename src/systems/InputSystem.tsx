import { useKeyboard } from '@/hooks/useKeyboard'

/**
 * Mounts non-DOM input listeners (keyboard for desktop dev).
 * Touch input is handled by the DOM VirtualJoystick component in the UI layer.
 *
 * This component renders nothing into the 3D scene.
 */
export function InputSystem() {
  useKeyboard()
  return null
}
