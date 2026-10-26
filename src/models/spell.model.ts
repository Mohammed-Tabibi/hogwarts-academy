import type { SpellCategory } from "../types/types";
import type { IDamageable, IHealable } from "../interfaces/actions.interface";

export abstract class SpellModel {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly category: SpellCategory,
    readonly power: number,
    readonly energyCost: number
  ) {}

  abstract apply(caster: IHealable, target: IDamageable): string;
}

export class AttackSpell extends SpellModel {
  constructor(id: number, name: string, power: number, energyCost: number) {
    super(id, name, "attack", power, energyCost);
  }

  override apply(caster: IHealable, target: IDamageable): string {
    target.takeDamage(this.power);
    return `deals ${this.power} damage`;
  }
}

export class DefenseSpell extends SpellModel {
  constructor(id: number, name: string, power: number, energyCost: number) {
    super(id, name, "defense", power, energyCost);
  }

  override apply(caster: IHealable, target: IDamageable): string {
    return `shields for ${this.power} points`;
  }
}

export class HealingSpell extends SpellModel {
  constructor(id: number, name: string, power: number, energyCost: number) {
    super(id, name, "healing", power, energyCost);
  }

  override apply(caster: IHealable, target: IDamageable): string {
    caster.heal(this.power);
    return `restores ${this.power} health`;
  }
}
