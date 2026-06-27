export interface RuntimeRecord {
  id: string
  alive: boolean
}

export class RuntimeCollection<T extends RuntimeRecord> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  all(): readonly T[] {
    return this.items
  }

  mutable(): T[] {
    return this.items
  }

  count(): number {
    return this.items.length
  }

  find(id: string): T | undefined {
    return this.items.find((item) => item.id === id)
  }

  remove(id: string): void {
    const i = this.items.findIndex((item) => item.id === id)
    if (i >= 0) this.items.splice(i, 1)
  }

  prune(): number {
    const before = this.items.length
    this.items = this.items.filter((item) => item.alive)
    return before - this.items.length
  }

  clear(): void {
    this.items.length = 0
  }
}
