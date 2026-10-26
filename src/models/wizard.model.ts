import type { ISpellCaster, IDamageable, IHealable, ILearner } from "../interfaces/actions.interface";
import type { SpellModel } from "./spell.model";
import type { House } from "../types/types";
import { Character } from "./character.model";

export class WizardCharacter
  extends Character
  implements ISpellCaster, IDamageable, IHealable, ILearner
{
  private _mana: number;
  private _health: number;
  private readonly learnedSpells: SpellModel[] = [];

  constructor(
    id: number,
    name: string,
    house: House,
    level: number,
    mana = 100,
    health = 100
  ) {
    super(id, name, house, level);
    this._mana = mana;
    this._health = health;
  }

  get mana(): number {
    return this._mana;
  }

  get health(): number {
    return this._health;
  }

  learnSpell(spell: SpellModel): void {
    this.learnedSpells.push(spell);
  }

  getLearnedSpells(): readonly SpellModel[] {
    return this.learnedSpells;
  }

  castSpell(spell: SpellModel, target: IDamageable): string {
    if (this._mana < spell.energyCost) {
      throw new Error(`${this.name} does not have enough mana to cast ${spell.name}`);
    }
    this._mana -= spell.energyCost;
    const effect = spell.apply(this, target);
    return `${this.name} casts ${spell.name}! It ${effect}`;
  }

  takeDamage(amount: number): void {
    this._health = Math.max(0, this._health - amount);
  }

  heal(amount: number): void {
    this._health = Math.min(100, this._health + amount);
  }

  isAlive(): boolean {
    return this._health > 0;
  }

  override describe(): string {
    return `Wizard ${this.name} [${this.house}] — Level ${this.getLevel()} — HP: ${this._health} — Mana: ${this._mana}`;
  }
}
