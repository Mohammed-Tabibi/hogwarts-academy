import type { House, HousePoints, Wizard } from "../types/types";
import type { WizardRepository } from "../repositories/wizard.repository";

export class HouseService {
  private readonly points: HousePoints = {
    Gryffindor: 0,
    Slytherin: 0,
    Ravenclaw: 0,
    Hufflepuff: 0,
  };

  constructor(private readonly wizardRepository?: WizardRepository) {}

  awardPoints(house: House, amount: number): void {
    if (amount < 0) {
      throw new Error("Points to award must be positive");
    }
    this.points[house] += amount;
  }

  deductPoints(house: House, amount: number): void {
    if (amount < 0) {
      throw new Error("Points to deduct must be positive");
    }
    this.points[house] = Math.max(0, this.points[house] - amount);
  }

  getPoints(house: House): number {
    return this.points[house];
  }

  getAllPoints(): Readonly<HousePoints> {
    return { ...this.points };
  }

  getLeaderboard(): { house: House; points: number }[] {
    const houses: House[] = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];
    return houses
      .map(house => ({ house, points: this.points[house] }))
      .sort((a, b) => b.points - a.points);
  }

  getLeadingHouse(): House {
    return this.getLeaderboard()[0].house;
  }

  getHouseMembers(house: House): readonly Wizard[] {
    if (!this.wizardRepository) {
      return [];
    }
    return this.wizardRepository.findByHouse(house);
  }
}
