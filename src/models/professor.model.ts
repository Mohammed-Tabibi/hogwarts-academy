import type { ITeacher, ILearner } from "../interfaces/actions.interface";
import type { SpellModel } from "./spell.model";
import type { House } from "../types/types";
import { Character } from "./character.model";

export class ProfessorCharacter extends Character implements ITeacher {
  readonly subject: string;

  constructor(
    id: number,
    name: string,
    house: House,
    level: number,
    subject: string
  ) {
    super(id, name, house, level);
    this.subject = subject;
  }

  teach(student: ILearner, spell: SpellModel): string {
    student.learnSpell(spell);
    return `Professor ${this.name} teaches ${spell.name} to ${student.name}`;
  }

  override describe(): string {
    return `Professor ${this.name} [${this.house}] — ${this.subject} teacher — Level ${this.getLevel()}`;
  }
}
