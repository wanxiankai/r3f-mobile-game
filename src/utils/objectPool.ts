/**
 * Generic object pool for high-churn objects (particles, bullets logic,
 * pooled Three.js meshes). Avoids GC pressure from frequent alloc/free.
 */
export class ObjectPool<T> {
  private readonly free: T[] = []
  private readonly active = new Set<T>()
  private readonly factory: () => T
  private readonly reset?: (item: T) => void

  constructor(factory: () => T, options?: { initial?: number; reset?: (item: T) => void }) {
    this.factory = factory
    this.reset = options?.reset
    const initial = options?.initial ?? 0
    for (let i = 0; i < initial; i++) {
      this.free.push(this.factory())
    }
  }

  acquire(): T {
    const item = this.free.pop() ?? this.factory()
    this.active.add(item)
    return item
  }

  release(item: T): void {
    if (!this.active.delete(item)) return
    this.reset?.(item)
    this.free.push(item)
  }

  releaseAll(): void {
    for (const item of this.active) {
      this.reset?.(item)
      this.free.push(item)
    }
    this.active.clear()
  }

  get activeCount(): number {
    return this.active.size
  }

  get freeCount(): number {
    return this.free.length
  }

  forEachActive(cb: (item: T) => void): void {
    this.active.forEach(cb)
  }
}
