import type { IRepository } from "../interfaces/repository.interface";
import { Log, MeasureTime } from "../decorators/decorators";

export class InMemoryRepository<T extends { id: number }>
  implements IRepository<T>
{
  private readonly items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): readonly T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);
    if (!item) return false;
    Object.assign(item, changes);
    return true;
  }
}
