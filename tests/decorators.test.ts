import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Cache, ValidateSpellPower, Log, MeasureTime } from "../src/decorators/decorators";
import type { Spell } from "../src/types/types";

class MathService {
  calls = 0;

  @Cache
  compute(a: number, b: number): number {
    this.calls++;
    return a * b;
  }
}

class SpellManager {
  spells: Spell[] = [];

  @ValidateSpellPower
  addSpell(spell: Spell): void {
    this.spells.push(spell);
  }
}

class AuditedService {
  @Log
  @MeasureTime
  greet(name: string): string {
    return `Hello, ${name}`;
  }
}

describe("Method Decorators", () => {
  describe("@Cache", () => {
    it("should cache identical calls per instance", () => {
      const service = new MathService();
      const r1 = service.compute(4, 5);
      const r2 = service.compute(4, 5);

      assert.equal(r1, 20);
      assert.equal(r2, 20);
      assert.equal(service.calls, 1);

      const r3 = service.compute(2, 3);
      assert.equal(r3, 6);
      assert.equal(service.calls, 2);
    });

    it("should keep cache separate between instances", () => {
      const s1 = new MathService();
      const s2 = new MathService();

      s1.compute(3, 3);
      s2.compute(3, 3);

      assert.equal(s1.calls, 1);
      assert.equal(s2.calls, 1);
    });
  });

  describe("@ValidateSpellPower", () => {
    it("should allow spells with zero or positive power", () => {
      const manager = new SpellManager();
      assert.doesNotThrow(() => {
        manager.addSpell({ id: 1, name: "Shield", category: "defense", power: 0 });
        manager.addSpell({ id: 2, name: "Fireball", category: "attack", power: 50 });
      });
      assert.equal(manager.spells.length, 2);
    });

    it("should throw an error for spells with negative power", () => {
      const manager = new SpellManager();
      assert.throws(
        () => {
          manager.addSpell({ id: 3, name: "Corrupt Spell", category: "attack", power: -25 });
        },
        {
          name: "Error",
          message: "Spell power cannot be negative",
        }
      );
      assert.equal(manager.spells.length, 0);
    });
  });

  describe("@Log & @MeasureTime", () => {
    it("should preserve original method behavior and return values", () => {
      const service = new AuditedService();
      const message = service.greet("Albus");
      assert.equal(message, "Hello, Albus");
    });
  });
});
