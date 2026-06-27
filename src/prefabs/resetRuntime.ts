import { enemyRegistry } from '@/systems/enemyRegistry'
import { projectileRegistry } from '@/prefabs/projectiles/projectileRegistry'
import { useInputStore } from '@/stores/inputStore'
import { usePerformanceStore } from '@/stores/performanceStore'

export function resetRuntimePrefabs(): void {
  enemyRegistry.clear()
  projectileRegistry.clear()
  useInputStore.getState().resetInput()
  usePerformanceStore.getState().resetPerformance()
}
