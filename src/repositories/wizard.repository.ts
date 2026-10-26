import type { Wizard } from "../types/types";
import { InMemoryRepository } from "./in-memory.repository";

export class WizardRepository extends InMemoryRepository<Wizard> {
  findByHouse(house: Wizard["house"]): Wizard[] {
    return this.getAll().filter(wizard => wizard.house === house);
  }

  addWizard(data: Omit<Wizard, "id">): Wizard {
    const id = this.getAll().length + 1;
    const wizard = { id, ...data } as Wizard;
    this.add(wizard);
    return wizard;
  }
}
