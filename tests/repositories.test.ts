import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { WizardRepository } from "../src/repositories/wizard.repository";
import { SpellRepository } from "../src/repositories/spell.repository";

describe("Repositories", () => {
  describe("WizardRepository", () => {
    it("should auto-increment ID with addWizard (Exercise 1)", () => {
      const repo = new WizardRepository();
      const w1 = repo.addWizard({ name: "Harry Potter", house: "Gryffindor", level: 1, active: true });
      const w2 = repo.addWizard({ name: "Ron Weasley", house: "Gryffindor", level: 1, active: true });

      assert.equal(w1.id, 1);
      assert.equal(w2.id, 2);
      assert.equal(repo.getAll().length, 2);
    });

    it("should filter wizards by house using indexed access type (Exercise 2)", () => {
      const repo = new WizardRepository();
      repo.addWizard({ name: "Harry", house: "Gryffindor", level: 1, active: true });
      repo.addWizard({ name: "Hermione", house: "Gryffindor", level: 2, active: true });
      repo.addWizard({ name: "Draco", house: "Slytherin", level: 1, active: true });
      repo.addWizard({ name: "Luna", house: "Ravenclaw", level: 1, active: true });

      const gryffindors = repo.findByHouse("Gryffindor");
      assert.equal(gryffindors.length, 2);
      assert.deepEqual(gryffindors.map(w => w.name), ["Harry", "Hermione"]);

      const hufflepuffs = repo.findByHouse("Hufflepuff");
      assert.equal(hufflepuffs.length, 0);
    });

    it("should find and update wizards", () => {
      const repo = new WizardRepository();
      const w = repo.addWizard({ name: "Neville", house: "Gryffindor", level: 1, active: true });

      const found = repo.findById(w.id);
      assert.ok(found);
      assert.equal(found?.name, "Neville");

      const updated = repo.update(w.id, { level: 5 });
      assert.equal(updated, true);
      assert.equal(repo.findById(w.id)?.level, 5);
    });
  });

  describe("SpellRepository", () => {
    it("should store spells and reject negative power via decorator", () => {
      const repo = new SpellRepository();
      repo.add({ id: 1, name: "Alohomora", category: "defense", power: 10 });
      assert.equal(repo.getAll().length, 1);

      assert.throws(() => {
        repo.add({ id: 2, name: "Dark Magic", category: "attack", power: -100 });
      });
      assert.equal(repo.getAll().length, 1);
    });
  });
});
