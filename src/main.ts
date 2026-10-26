import type {
  House,
  Wizard,
  Spell,
  AcademyEvent,
  SpellCastEvent,
  SpellOutput,
  ArrayElement,
  NewWizard,
  WizardSummary,
  WizardUpdate,
  HousePoints,
  DuelResult,
  WizardWithStats
} from "./types/types";

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

console.log(createWizardSummary(sampleWizard));
console.log(handleSpellCast(sampleEvent));
