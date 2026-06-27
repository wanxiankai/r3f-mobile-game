import type { InputVector } from '@/types/game'

export type ActionPhase = 'pressed' | 'released' | 'held'
export type ActionValue = boolean | InputVector

export interface ActionBinding {
  action: string
  label: string
  kind: 'vector2' | 'button'
  keyboard?: string[]
  touch?: {
    zone: 'left-stick' | 'right-button' | 'custom'
    label?: string
  }
}

export interface ActionMap {
  bindings: ActionBinding[]
}

export const DEFAULT_ACTION_MAP: ActionMap = {
  bindings: [
    {
      action: 'move',
      label: 'Move',
      kind: 'vector2',
      keyboard: ['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'],
      touch: { zone: 'left-stick' }
    },
    {
      action: 'jump',
      label: 'Jump',
      kind: 'button',
      keyboard: [' '],
      touch: { zone: 'right-button', label: 'A' }
    },
    {
      action: 'fire',
      label: 'Fire',
      kind: 'button',
      keyboard: ['j'],
      touch: { zone: 'right-button', label: 'A' }
    }
  ]
}

export function findActionByKey(map: ActionMap, key: string): ActionBinding | undefined {
  const normalized = key.toLowerCase()
  return map.bindings.find((binding) => binding.keyboard?.includes(normalized))
}

export function getTouchBinding(map: ActionMap, zone: NonNullable<ActionBinding['touch']>['zone']) {
  return map.bindings.find((binding) => binding.touch?.zone === zone)
}
