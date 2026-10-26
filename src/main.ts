import { WizardRepository } from "./repositories/wizard.repository";
import { SpellRepository } from "./repositories/spell.repository";
import { isWizard, isHouse } from "./guards/guards";
import { Cache } from "./decorators/decorators";
import { WizardCharacter } from "./models/wizard.model";
import { ProfessorCharacter } from "./models/professor.model";
import { AttackSpell, DefenseSpell, HealingSpell } from "./models/spell.model";
import type { Character } from "./models/character.model";
import type { SpellCastEvent } from "./types/types";
import { HouseService } from "./services/house.service";
import { DuelService } from "./services/duel.service";

class SpellCalculator {
  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    console.log("Calculating...");
    return basePower * multiplier;
  }
}

function handleSpellCastEvent(event: SpellCastEvent): void {
  console.log(`[EVENT] Wizard #${event.wizardId} cast spell: ${event.spellName}`);
}

const wizards = new WizardRepository();
const spells = new SpellRepository();

console.log("\n=== TAF Exercises ===");

console.log("\n--- Exercise 1: addWizard without id ---");
const harryData = wizards.addWizard({ name: "Harry Potter", house: "Gryffindor", level: 5, active: true, patronus: "Stag" });
const hermioneData = wizards.addWizard({ name: "Hermione Granger", house: "Gryffindor", level: 8, active: true });
const dracoData = wizards.addWizard({ name: "Draco Malfoy", house: "Slytherin", level: 6, active: true });
console.log("Harry:", harryData.name, "ID:", harryData.id);
console.log("Hermione:", hermioneData.name, "ID:", hermioneData.id);
console.log("Draco:", dracoData.name, "ID:", dracoData.id);

console.log("\n--- Exercise 2: findByHouse ---");
const gryffindors = wizards.findByHouse("Gryffindor");
console.log("Gryffindors:", gryffindors.map(w => w.name));

console.log("\n--- Exercise 3: Extract SpellCastEvent ---");
const sampleEvent: SpellCastEvent = {
  type: "spell-cast",
  wizardId: 1,
  spellName: "Expelliarmus"
};
handleSpellCastEvent(sampleEvent);

console.log("\n--- Exercise 4: ValidateSpellPower ---");
spells.add({ id: 101, name: "Expelliarmus", category: "attack", power: 80 });
try {
  spells.add({ id: 102, name: "Dark Curse", category: "attack", power: -50 });
} catch (error: unknown) {
  if (error instanceof Error) console.log("Rejected:", error.message);
}

console.log("\n--- Exercise 5: Cache decorator ---");
const calculator = new SpellCalculator();
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(10, 3));

console.log("\n--- Exercise 6: Type Guards ---");
const validData: unknown = { id: 1, name: "Harry Potter", house: "Gryffindor", level: 5, active: true };
const badData: unknown = { id: 2, name: "Viktor", house: "Durmstrang", level: 5, active: true };
console.log("isWizard(valid):", isWizard(validData));
console.log("isWizard(Durmstrang):", isWizard(badData));
console.log("isHouse(Ravenclaw):", isHouse("Ravenclaw"));
console.log("isHouse(Durmstrang):", isHouse("Durmstrang"));

console.log("\n=== OOP Model Demo ===");

const expelliarmus = new AttackSpell(1, "Expelliarmus", 40, 20);
const protego = new DefenseSpell(2, "Protego", 30, 15);
const episkey = new HealingSpell(3, "Episkey", 25, 10);

const harry = new WizardCharacter(1, "Harry Potter", "Gryffindor", 5);
const draco = new WizardCharacter(2, "Draco Malfoy", "Slytherin", 6);
const mcGonagall = new ProfessorCharacter(1, "Minerva McGonagall", "Gryffindor", 15, "Transfiguration");

console.log("\n--- describe() polymorphism (LSP) ---");
const characters: Character[] = [harry, draco, mcGonagall];
characters.forEach(c => console.log(c.describe()));

console.log("\n--- Professor teaches spell ---");
console.log(mcGonagall.teach(harry, expelliarmus));
console.log(mcGonagall.teach(harry, protego));
console.log(mcGonagall.teach(harry, episkey));
console.log(mcGonagall.teach(draco, expelliarmus));
console.log("Harry knows:", harry.getLearnedSpells().map(s => s.name));

console.log("\n--- Wizard casts spells ---");
console.log(harry.castSpell(expelliarmus, draco));
console.log(`Draco HP: ${draco.health}`);

console.log(harry.castSpell(episkey, draco));
console.log(`Harry HP after self-heal: ${harry.health} | Draco HP: ${draco.health}`);

console.log(harry.castSpell(protego, draco));
console.log(`Harry Mana after 3 spells: ${harry.mana}`);

console.log("\n--- Not enough mana ---");
const weakWizard = new WizardCharacter(3, "Neville", "Gryffindor", 1, 5);
try {
  weakWizard.castSpell(expelliarmus, draco);
} catch (error: unknown) {
  if (error instanceof Error) console.log("Error:", error.message);
}

console.log("\n=== Services Demo (HouseService & DuelService) ===");

const houseService = new HouseService(wizards);
houseService.awardPoints("Gryffindor", 100);
houseService.awardPoints("Ravenclaw", 90);
houseService.awardPoints("Hufflepuff", 80);
houseService.awardPoints("Slytherin", 95);

console.log("\n--- Leaderboard before duel ---");
console.table(houseService.getLeaderboard());

const duelService = new DuelService(houseService);
duelService.onSpellCast(handleSpellCastEvent);

console.log("\n--- Starting Duel: Harry (Gryffindor) vs Draco (Slytherin) ---");
const [winnerId, loserId] = duelService.duel(harry, draco);
console.log(`Duel finished! Winner: Wizard #${winnerId}, Loser: Wizard #${loserId}`);

console.log("\n--- Leaderboard after duel (+50 pts to winner's house) ---");
console.table(houseService.getLeaderboard());
console.log(`Leading House: ${houseService.getLeadingHouse()}`);
