export interface IRepository<T extends { id: number }> {
  add(item: T): void;
  findById(id: number): T | undefined;
  getAll(): readonly T[];
  update(id: number, changes: Partial<T>): boolean;
}
