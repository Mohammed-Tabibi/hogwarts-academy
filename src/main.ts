import type {
  Wizard,
  Spell,
  SpellCastEvent,
  WizardSummary,
  HousePoints,
  DuelResult,
  WizardWithStats,
  NewWizard,
  WizardUpdate,
  SpellOutput,
  ArrayElement
} from "./types/types";

import { isHouse, isWizard } from "./guards/guards";
import { Log, MeasureTime, ValidateSpellPower, Cache } from "./decorators/decorators";

class SpellCalculator {
  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    console.log("Calculating...");
    return basePower * multiplier;
  }
}

class SpellRegistry {
  private readonly spells: Spell[] = [];

  @ValidateSpellPower
  @Log
  add(spell: Spell): void {
    this.spells.push(spell);
  }

  @MeasureTime
  findById(id: number): Spell | undefined {
    return this.spells.find(s => s.id === id);
  }

  getAll(): readonly Spell[] {
    return this.spells;
  }
}

export function createWizardSummary(wizard: Wizard): WizardSummary {
  return {
    id: wizard.id,
    name: wizard.name,
    house: wizard.house
  };
}

export function handleSpellCast(event: SpellCastEvent): string {
  return `Wizard ${event.wizardId} cast ${event.spellName}`;
}

const sampleWizard: Wizard = {
  id: 1,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  patronus: "Stag"
};

const sampleNewWizard: NewWizard = {
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 7,
  active: true
};

const samplePoints: HousePoints = {
  Gryffindor: 150,
  Slytherin: 140,
  Ravenclaw: 130,
  Hufflepuff: 120
};

const sampleDuelResult: DuelResult = [1, 2];

const sampleEvent: SpellCastEvent = {
  type: "spell-cast",
  wizardId: 1,
  spellName: "Expelliarmus"
};

const sampleWizardStats: WizardWithStats = {
  ...sampleWizard,
  mana: 100,
  health: 100
};

const validData: unknown = {
  id: 1,
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true
};

const invalidData: unknown = {
  id: 2,
  name: "Viktor",
  house: "Durmstrang",
  level: 5,
  active: true
};

type AttackOutput = SpellOutput<"attack">;
type DefenseOutput = SpellOutput<"defense">;
type HealingOutput = SpellOutput<"healing">;
type SpellItem = ArrayElement<Spell[]>;

const compileTimeChecks: [
  AttackOutput,
  DefenseOutput,
  HealingOutput,
  SpellItem,
  WizardUpdate
] | null = null;

void compileTimeChecks;
void sampleNewWizard;
void samplePoints;
void sampleDuelResult;
void sampleWizardStats;

console.log("\n--- Type Guards ---");
console.log(createWizardSummary(sampleWizard));
console.log(handleSpellCast(sampleEvent));
console.log("isWizard(Harry Potter data):", isWizard(validData));
console.log("isWizard(Durmstrang data):", isWizard(invalidData));
console.log("isHouse(Ravenclaw):", isHouse("Ravenclaw"));
console.log("isHouse(Durmstrang):", isHouse("Durmstrang"));

console.log("\n--- Cache decorator (Exercice 5) ---");
const calculator = new SpellCalculator();
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(5, 2));

console.log("\n--- ValidateSpellPower decorator (Exercice 4) ---");
const registry = new SpellRegistry();

registry.add({ id: 101, name: "Expelliarmus", category: "attack", power: 80 });

try {
  registry.add({ id: 102, name: "Dark Curse", category: "attack", power: -50 });
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log("Rejected spell:", error.message);
  }
}

console.log("\n--- MeasureTime decorator ---");
registry.findById(101);
