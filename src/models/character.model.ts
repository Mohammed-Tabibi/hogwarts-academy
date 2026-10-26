import type { House } from "../types/types";

export abstract class Character {
  protected level: number;

  constructor(
    readonly id: number,
    readonly name: string,
    readonly house: House,
    level: number
  ) {
    this.level = level;
  }

  getLevel(): number {
    return this.level;
  }

  levelUp(): void {
    this.level += 1;
  }

  abstract describe(): string;
}
