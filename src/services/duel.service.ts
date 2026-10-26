import type { DuelResult, SpellCastEvent } from "../types/types";
import type { WizardCharacter } from "../models/wizard.model";
import type { HouseService } from "./house.service";

export type SpellCastEventHandler = (event: SpellCastEvent) => void;

export class DuelService {
  private readonly eventHandlers: SpellCastEventHandler[] = [];

  constructor(private readonly houseService?: HouseService) {}

  onSpellCast(handler: SpellCastEventHandler): void {
    this.eventHandlers.push(handler);
  }

  private emitSpellCast(wizardId: number, spellName: string): void {
    const event: SpellCastEvent = {
      type: "spell-cast",
      wizardId,
      spellName,
    };
    for (const handler of this.eventHandlers) {
      handler(event);
    }
  }

  duel(
    duelist1: WizardCharacter,
    duelist2: WizardCharacter,
    maxRounds = 10
  ): DuelResult {
    let round = 1;

    while (duelist1.isAlive() && duelist2.isAlive() && round <= maxRounds) {
      this.executeTurn(duelist1, duelist2);
      if (!duelist2.isAlive()) break;

      this.executeTurn(duelist2, duelist1);
      if (!duelist1.isAlive()) break;

      round++;
    }

    const winner = duelist1.health >= duelist2.health ? duelist1 : duelist2;
    const loser = winner === duelist1 ? duelist2 : duelist1;

    if (this.houseService) {
      this.houseService.awardPoints(winner.house, 50);
    }

    return [winner.id, loser.id] as const;
  }

  private executeTurn(attacker: WizardCharacter, defender: WizardCharacter): void {
    const learnedSpells = attacker.getLearnedSpells();
    const castableSpells = learnedSpells.filter(s => attacker.mana >= s.energyCost);

    if (castableSpells.length > 0) {
      const spell = castableSpells[0];
      attacker.castSpell(spell, defender);
      this.emitSpellCast(attacker.id, spell.name);
    } else {
      defender.takeDamage(10);
    }
  }
}
