import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isHouse, isWizard, isSpell } from "../src/guards/guards";

describe("Type Guards", () => {
  describe("isHouse", () => {
    it("should accept valid Hogwarts houses", () => {
      assert.equal(isHouse("Gryffindor"), true);
      assert.equal(isHouse("Slytherin"), true);
      assert.equal(isHouse("Ravenclaw"), true);
      assert.equal(isHouse("Hufflepuff"), true);
    });

    it("should reject invalid houses", () => {
      assert.equal(isHouse("Durmstrang"), false);
      assert.equal(isHouse("Beauxbatons"), false);
      assert.equal(isHouse(""), false);
      assert.equal(isHouse(123), false);
      assert.equal(isHouse(null), false);
      assert.equal(isHouse(undefined), false);
    });
  });

  describe("isWizard", () => {
    it("should accept valid wizard objects", () => {
      const valid = {
        id: 1,
        name: "Harry Potter",
        house: "Gryffindor",
        level: 5,
        active: true,
      };
      assert.equal(isWizard(valid), true);
    });

    it("should reject wizards with foreign school houses", () => {
      const foreign = {
        id: 2,
        name: "Viktor Krum",
        house: "Durmstrang",
        level: 7,
        active: true,
      };
      assert.equal(isWizard(foreign), false);
    });

    it("should reject invalid or incomplete data structures", () => {
      assert.equal(isWizard(null), false);
      assert.equal(isWizard(undefined), false);
      assert.equal(isWizard("Harry"), false);
      assert.equal(isWizard({ id: 1, name: "No house" }), false);
      assert.equal(isWizard({ id: "1", name: "Harry", house: "Gryffindor", level: 5, active: true }), false);
    });
  });

  describe("isSpell", () => {
    it("should validate conformant spell objects", () => {
      const validSpell = {
        id: 10,
        name: "Lumos",
        category: "defense",
        power: 10,
      };
      assert.equal(isSpell(validSpell), true);
    });

    it("should reject spells with non-numeric power or wrong category", () => {
      assert.equal(isSpell({ id: 1, name: "Bad", category: "unknown", power: 10 }), false);
      assert.equal(isSpell({ id: 1, name: "Bad", category: "attack", power: "strong" }), false);
      assert.equal(isSpell(null), false);
    });
  });
});
