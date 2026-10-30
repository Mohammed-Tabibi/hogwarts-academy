import {
  type Wizard,
  type Spell,
  type AcademyEvent,
  type House,
  type HousePoints,
  type SpellCategory,
  type SpellOutput,
  type ArrayElement,
  type WizardSummary,
  type WizardUpdate,
  type AttackSpell,
  type NonHealingCategory,
  type SpellCastEvent,
} from "./types";

import { WizardRepository, SpellRepository } from "./repository";
import { Log, Cache } from "./decorators";

// TAF Exercice 6 - Étape 1 : Créer un type guard dédié à isHouse() (Slide 11)
const validHouses: readonly House[] = [
  "Gryffindor",
  "Slytherin",
  "Ravenclaw",
  "Hufflepuff"
];

function isHouse(value: unknown): value is House {
  return (
    typeof value === "string" &&
    validHouses.some(house => house === value)
  );
}

// TAF Exercice 6 - Étape 2 : Mise à jour de la fonction isWizard() (Slide 12)
function isWizard(value: unknown): value is Wizard {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isHouse(candidate.house) &&
    typeof candidate.level === "number" &&
    typeof candidate.active === "boolean"
  );
}

// TAF Exercice 3 - Étape 2 : Créer un eventHandler (Slide 5)
function handleSpellCast(event: SpellCastEvent): void {
  console.log(
    `Wizard ${event.wizardId} cast ${event.spellName}`
  );
}

// TAF Exercice 5 - Étape 2 : Appliquer le décorateur Cache dans SpellCalculator (Slide 10)
class SpellCalculator {
  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    console.log("Calculating...");
    return basePower * multiplier;
  }
}

class AcademyService {
  constructor(
    private readonly wizards: WizardRepository,
    private readonly spells: SpellRepository
  ) {}

  @Log
  castSpell(wizardId: number, spellId: number): string {
    const wizard = this.wizards.findById(wizardId);
    const spell = this.spells.findById(spellId);

    if (!wizard || !spell) {
      throw new Error("Wizard or spell not found");
    }

    return `${wizard.name} casts ${spell.name}!`;
  }

  findByHouse(house: House): WizardSummary[] {
    return this.wizards
      .getAll()
      .filter(wizard => wizard.house === house)
      .map(({ id, name, house }) => ({ id, name, house }));
  }

  updateWizard(id: number, changes: WizardUpdate): boolean {
    return this.wizards.update(id, changes);
  }

  getSpellEvents(events: AcademyEvent[]): Extract<AcademyEvent, { type: "spell-cast" }>[] {
    return events.filter(
      (event): event is Extract<AcademyEvent, { type: "spell-cast" }> =>
        event.type === "spell-cast"
    );
  }
}

const wizards = new WizardRepository();
const spells = new SpellRepository();

console.log("\n========================================");
console.log("    HOGWARTS ACADEMY — RÉALISATION TAF   ");
console.log("========================================");

// --- Exercice 1 : Ajouter un nouveau sorcier (Slide 2) ---
console.log("\n--- Exercice 1 : addWizard avec NewWizard ---");
const harry = wizards.addWizard({
  name: "Harry Potter",
  house: "Gryffindor",
  level: 5,
  active: true,
  patronus: "Stag"
});
const hermione = wizards.addWizard({
  name: "Hermione Granger",
  house: "Gryffindor",
  level: 8,
  active: true
});
const draco = wizards.addWizard({
  name: "Draco Malfoy",
  house: "Slytherin",
  level: 6,
  active: true
});
console.log("Harry ajouté avec ID :", harry.id);
console.log("Hermione ajoutée avec ID :", hermione.id);
console.log("Draco ajouté avec ID :", draco.id);

// --- Exercice 2 : Filtrer les sorciers par maison (Slide 3) ---
console.log("\n--- Exercice 2 : findByHouse avec indexed access type ---");
const gryffindors = wizards.findByHouse("Gryffindor");
console.log("Sorciers de Gryffindor :", gryffindors.map(w => w.name));

// --- Exercice 3 : Événement de lancement de sort (Slides 4 & 5) ---
console.log("\n--- Exercice 3 : Extract SpellCastEvent & handleSpellCast ---");
handleSpellCast({
  type: "spell-cast",
  wizardId: 1,
  spellName: "Expelliarmus"
});

// --- Exercice 4 : Validation de puissance de sort (Slides 6, 7 & 8) ---
console.log("\n--- Exercice 4 : ValidateSpellPower sur SpellRepository ---");
spells.add({
  id: 102,
  name: "Protego",
  category: "defense",
  power: 50
});

try {
  spells.add({
    id: 103,
    name: "Invalid Spell",
    category: "attack",
    power: -10
  });
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log("Sort rejeté :", error.message);
  }
}

// --- Exercice 5 : Décorateur de méthode avec mise en cache (Slides 9 & 10) ---
console.log("\n--- Exercice 5 : Cache decorator sur SpellCalculator ---");
const calculator = new SpellCalculator();
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(5, 2));

// --- Exercice 6 : Renforcer les Type Guards (Slides 11, 12 & 13) ---
console.log("\n--- Exercice 6 : Type Guards isHouse() et isWizard() ---");
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

console.log("isWizard(validData) :", isWizard(validData));       // true
console.log("isWizard(invalidData) :", isWizard(invalidData));   // false

// --- Démonstrations complémentaires du projet initial ---
console.log("\n--- Démonstrations initiales : AcademyService ---");
const academy = new AcademyService(wizards, spells);
spells.add({
  id: 101,
  name: "Expelliarmus",
  category: "attack",
  power: 80
});
console.log(academy.castSpell(1, 101));

academy.updateWizard(1, { level: 6 });
console.log("Harry mis à jour :", wizards.findById(1));

const points: HousePoints = {
  Gryffindor: 100,
  Slytherin: 80,
  Ravenclaw: 90,
  Hufflepuff: 70
};
console.log("Points des maisons :", points);

const events: AcademyEvent[] = [
  { type: "spell-cast", wizardId: 1, spellName: "Lumos" },
  { type: "level-up", wizardId: 2, newLevel: 9 },
  { type: "wizard-expelled", wizardId: 3 }
];
console.log("Événements filtrés :", academy.getSpellEvents(events));

// Compile-time demonstrations
type CastArguments = Parameters<AcademyService["castSpell"]>;
type CastResult = ReturnType<AcademyService["castSpell"]>;
type AttackOutput = SpellOutput<"attack">;
type HealingOutput = SpellOutput<"healing">;
type SpellItem = ArrayElement<Spell[]>;
type AttackSpellExample = AttackSpell;
type RemainingCategories = NonHealingCategory;
type CategoryExample = SpellCategory;

const typeExamples: [
  CastArguments,
  CastResult,
  AttackOutput,
  HealingOutput,
  SpellItem,
  AttackSpellExample["category"],
  RemainingCategories,
  CategoryExample
] | null = null;

void typeExamples;
