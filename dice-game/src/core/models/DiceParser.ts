import { MIN_DICE_COUNT } from "../../constants";
import { Dice } from "./Dice";

export class DiceParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiceParseError";
  }
}

export class DiceParser {
  static exampleFormat = "2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3";

  static parse(args: string[]): Dice[] {
    if (!args || args.length < MIN_DICE_COUNT) {
      throw new DiceParseError(
        `Error: At least ${MIN_DICE_COUNT} dice must be provided.\nExample: ${this.exampleFormat}`
      );
    }

    return args.map((arg, index) => {
      const trimmed = arg.trim();
      const parts = trimmed.split(",");

      if (parts.some((part) => !/^\d+$/.test(part))) {
        throw new DiceParseError(
          `Error: Dice #${
            index + 1
          } is invalid. Only comma-separated positive integers are allowed.\nReceived: "${arg}"`
        );
      }

      const nums = parts.map((n) => parseInt(n, 10));

      if (nums.length < 2) {
        throw new DiceParseError(
          `Error: Dice #${
            index + 1
          } must contain at least 2 values.\nReceived: "${arg}"`
        );
      }

      if (nums.some((n) => n <= 0)) {
        throw new DiceParseError(
          `Error: Dice #${
            index + 1
          } contains invalid values. Only positive integers are allowed.\nReceived: "${arg}"`
        );
      }
      return new Dice(nums);
    });
  }
}
