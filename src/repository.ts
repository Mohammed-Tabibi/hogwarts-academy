import type { Wizard, Spell, NewWizard } from "./types";
import { Log, MeasureTime, ValidateSpellPower } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

// TAF Exercice 1 & 2 : Modification de WizardRepository
export class WizardRepository extends Repository<Wizard> {
  // Exercice 2 : Filtrer les sorciers par maison (Slide 3)
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(
      wizard => wizard.house === house
    );
  }

  // Exercice 1 : Ajouter un sorcier à l'aide de NewWizard avec attribution automatique d'identifiant (Slides 1 & 2)
  addWizard(data: NewWizard): Wizard {
    const id = this.getAll().length + 1;
    const wizard = { id, ...data } as Wizard;
    this.add(wizard);
    return wizard;
  }
}

// TAF Exercice 4 - Étape 2 : Appliquer ValidateSpellPower au SpellRepository (Slide 7)
export class SpellRepository extends Repository<Spell> {
  @ValidateSpellPower
  override add(spell: Spell): void {
    super.add(spell);
  }
}
