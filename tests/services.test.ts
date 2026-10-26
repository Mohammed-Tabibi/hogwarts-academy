import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { HouseService } from "../src/services/house.service";
import { DuelService } from "../src/services/duel.service";
import { WizardRepository } from "../src/repositories/wizard.repository";
import { WizardCharacter } from "../src/models/wizard.model";
import { AttackSpell } from "../src/models/spell.model";
import type { SpellCastEvent } from "../src/types/types";

describe("Business Services", () => {
  describe("HouseService", () => {
    it("should award and deduct house points", () => {
      const service = new HouseService();
      service.awardPoints("Gryffindor", 50);
      service.awardPoints("Slytherin", 30);
      assert.equal(service.getPoints("Gryffindor"), 50);
      assert.equal(service.getPoints("Slytherin"), 30);

      service.deductPoints("Gryffindor", 20);
      assert.equal(service.getPoints("Gryffindor"), 30);

      service.deductPoints("Gryffindor", 100);
      assert.equal(service.getPoints("Gryffindor"), 0);
    });

    it("should compute correct leaderboard and leading house", () => {
      const service = new HouseService();
      service.awardPoints("Ravenclaw", 70);
      service.awardPoints("Gryffindor", 100);
      service.awardPoints("Hufflepuff", 40);

      const leaderboard = service.getLeaderboard();
      assert.equal(leaderboard[0].house, "Gryffindor");
      assert.equal(leaderboard[0].points, 100);
      assert.equal(service.getLeadingHouse(), "Gryffindor");
    });

    it("should retrieve house members via repository", () => {
      const repo = new WizardRepository();
      repo.addWizard({ name: "Harry", house: "Gryffindor", level: 1, active: true });
      repo.addWizard({ name: "Draco", house: "Slytherin", level: 1, active: true });

      const service = new HouseService(repo);
      const members = service.getHouseMembers("Gryffindor");
      assert.equal(members.length, 1);
      assert.equal(members[0].name, "Harry");
    });
  });

  describe("DuelService", () => {
    it("should conduct a duel, emit events and award points to winner", () => {
      const houseService = new HouseService();
      const duelService = new DuelService(houseService);

      const emittedEvents: SpellCastEvent[] = [];
      duelService.onSpellCast(e => emittedEvents.push(e));

      const harry = new WizardCharacter(1, "Harry", "Gryffindor", 5, 100, 100);
      const draco = new WizardCharacter(2, "Draco", "Slytherin", 5, 100, 40);

      const spell = new AttackSpell(1, "Stupefy", 30, 20);
      harry.learnSpell(spell);

      const [winnerId, loserId] = duelService.duel(harry, draco);

      assert.equal(winnerId, 1);
      assert.equal(loserId, 2);
      assert.ok(emittedEvents.length > 0);
      assert.equal(emittedEvents[0].spellName, "Stupefy");
      assert.equal(houseService.getPoints("Gryffindor"), 50);
    });
  });
});
