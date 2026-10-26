import { WizardRepository } from "./repositories/wizard.repository";
import { SpellRepository } from "./repositories/spell.repository";
import { isWizard, isHouse } from "./guards/guards";
import { Cache } from "./decorators/decorators";

class SpellCalculator {
  @Cache
  calculatePower(basePower: number, multiplier: number): number {
    console.log("Calculating...");
    return basePower * multiplier;
  }
}

const wizards = new WizardRepository();
const spells = new SpellRepository();

console.log("\n--- Exercice 1: addWizard sans id ---");
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

console.log("Harry:", harry);
console.log("Hermione:", hermione);
console.log("Draco:", draco);

console.log("\n--- Exercice 2: findByHouse ---");
const gryffindors = wizards.findByHouse("Gryffindor");
console.log("Gryffindor wizards:", gryffindors.map(w => w.name));

console.log("\n--- Sorts valide et invalide (Exercice 4) ---");
spells.add({ id: 101, name: "Expelliarmus", category: "attack", power: 80 });
spells.add({ id: 102, name: "Protego", category: "defense", power: 60 });

try {
  spells.add({ id: 103, name: "Dark Curse", category: "attack", power: -50 });
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log("Rejected spell:", error.message);
  }
}

console.log("All spells:", spells.getAll().map(s => s.name));

console.log("\n--- findById + update ---");
wizards.update(1, { level: 6 });
console.log("Harry level after update:", wizards.findById(1)?.level);

console.log("\n--- Type Guard (Exercice 6) ---");
const unknownData: unknown = { id: 1, name: "Harry Potter", house: "Gryffindor", level: 5, active: true };
const badData: unknown = { id: 2, name: "Viktor", house: "Durmstrang", level: 5, active: true };

console.log("isWizard(valid):", isWizard(unknownData));
console.log("isWizard(invalid house):", isWizard(badData));
console.log("isHouse(Ravenclaw):", isHouse("Ravenclaw"));
console.log("isHouse(Durmstrang):", isHouse("Durmstrang"));

console.log("\n--- Cache decorator (Exercice 5) ---");
const calculator = new SpellCalculator();
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(10, 3));
console.log(calculator.calculatePower(5, 2));
