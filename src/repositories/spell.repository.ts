import type { Spell } from "../types/types";
import { InMemoryRepository } from "./in-memory.repository";
import { ValidateSpellPower } from "../decorators/decorators";

export class SpellRepository extends InMemoryRepository<Spell> {
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}
