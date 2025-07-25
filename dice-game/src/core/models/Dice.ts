import { MIN_SIDES_PER_DICE } from "../../constants";

export class Dice {
  private readonly values: readonly number[];

  constructor(values: number[]) {
    this.validateValues(values);
    this.values = values;
  }

  private validateValues(values: number[]) {
    if (values.length < MIN_SIDES_PER_DICE) {
      throw new Error(
        `Each dice must contain at least ${MIN_SIDES_PER_DICE} sides.`
      );
    }
    if (!values.every((v) => Number.isInteger(v) && v > 0)) {
      throw new Error("All dice sides must be positive integers.");
    }
  }

  getSides(): number {
    return this.values.length;
  }

  getValues(): number[] {
    return [...this.values];
  }

  roll(): number {
    const randomIndex = Math.floor(Math.random() * this.values.length);
    return this.values[randomIndex];
  }

  getValueAt(index: number): number {
    if (index < 0 || index >= this.values.length) {
      throw new Error(`Invalid side index: ${index}`);
    }
    return this.values[index];
  }

  toString(): string {
    return `[${this.values.join(",")}]`;
  }
}
