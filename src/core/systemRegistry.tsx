import type { ReactNode } from 'react'

export type SystemPhase = 'environment' | 'entity' | 'logic' | 'rendering'

export interface SystemRenderContext {
  quality: string
}

export interface SystemEntry<TContext extends SystemRenderContext = SystemRenderContext> {
  id: string
  phase: SystemPhase
  order: number
  enabled?: boolean | ((context: TContext) => boolean)
  render: (context: TContext) => ReactNode
}

export function isSystemEnabled<TContext extends SystemRenderContext>(
  system: SystemEntry<TContext>,
  context: TContext
): boolean {
  if (typeof system.enabled === 'function') return system.enabled(context)
  return system.enabled ?? true
}

export function renderSystems<TContext extends SystemRenderContext>(
  systems: SystemEntry<TContext>[],
  context: TContext
): ReactNode[] {
  return systems
    .filter((system) => isSystemEnabled(system, context))
    .sort((a, b) => a.order - b.order)
    .map((system) => <FragmentRenderer key={system.id}>{system.render(context)}</FragmentRenderer>)
}

function FragmentRenderer({ children }: { children: ReactNode }) {
  return <>{children}</>
}
