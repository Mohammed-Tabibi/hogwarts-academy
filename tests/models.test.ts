import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { WizardCharacter } from "../src/models/wizard.model";
import { ProfessorCharacter } from "../src/models/professor.model";
import { AttackSpell, DefenseSpell, HealingSpell } from "../src/models/spell.model";

describe("OOP Models & Polymorphism", () => {
  it("should handle damage, healing and alive status", () => {
    const wizard = new WizardCharacter(1, "Harry", "Gryffindor", 5, 100, 100);
    assert.equal(wizard.isAlive(), true);

    wizard.takeDamage(40);
    assert.equal(wizard.health, 60);

    wizard.heal(20);
    assert.equal(wizard.health, 80);

    wizard.takeDamage(100);
    assert.equal(wizard.health, 0);
    assert.equal(wizard.isAlive(), false);
  });

  it("should enforce mana requirements when casting spells", () => {
    const wizard = new WizardCharacter(1, "Harry", "Gryffindor", 5, 30, 100);
    const target = new WizardCharacter(2, "Draco", "Slytherin", 5, 100, 100);
    const spell = new AttackSpell(10, "Expelliarmus", 40, 25);

    wizard.castSpell(spell, target);
    assert.equal(wizard.mana, 5);
    assert.equal(target.health, 60);

    assert.throws(
      () => wizard.castSpell(spell, target),
      /does not have enough mana/
    );
  });

  it("should apply polymorphic spells correctly", () => {
    const caster = new WizardCharacter(1, "Harry", "Gryffindor", 5, 100, 50);
    const target = new WizardCharacter(2, "Dummy", "Hufflepuff", 1, 100, 100);

    const attack = new AttackSpell(1, "Attack", 30, 10);
    const defense = new DefenseSpell(2, "Shield", 20, 10);
    const heal = new HealingSpell(3, "Heal", 25, 10);

    attack.apply(caster, target);
    assert.equal(target.health, 70);

    const defenseResult = defense.apply(caster, target);
    assert.ok(defenseResult.includes("shields"));

    heal.apply(caster, target);
    assert.equal(caster.health, 75);
  });

  it("should allow professor to teach spells to students", () => {
    const prof = new ProfessorCharacter(10, "McGonagall", "Gryffindor", 20, "Transfiguration");
    const student = new WizardCharacter(1, "Ron", "Gryffindor", 1);
    const spell = new DefenseSpell(1, "Protego", 30, 15);

    const message = prof.teach(student, spell);
    assert.ok(message.includes("teaches"));
    assert.equal(student.getLearnedSpells().length, 1);
    assert.equal(student.getLearnedSpells()[0].name, "Protego");
  });
});
