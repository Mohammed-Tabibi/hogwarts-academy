import type { SpellModel } from "../models/spell.model";

export interface IDamageable {
  readonly health: number;
  takeDamage(amount: number): void;
  isAlive(): boolean;
}

export interface IHealable {
  heal(amount: number): void;
}

export interface ILearner {
  readonly name: string;
  learnSpell(spell: SpellModel): void;
  getLearnedSpells(): readonly SpellModel[];
}

export interface ISpellCaster {
  readonly name: string;
  readonly mana: number;
  castSpell(spell: SpellModel, target: IDamageable): string;
}

export interface ITeacher {
  teach(student: ILearner, spell: SpellModel): string;
}
