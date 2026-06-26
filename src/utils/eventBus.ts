import mitt from 'mitt'

export type AppEvents = {
  'asset:progress': number // 0..1
  'asset:complete': void
  'asset:error': string
  'score:add': number
  'player:hit': void
  'player:dead': void
  'enemy:die': { id: string }
  'game:start': void
  'game:over': void
}

export const eventBus = mitt<AppEvents>()
