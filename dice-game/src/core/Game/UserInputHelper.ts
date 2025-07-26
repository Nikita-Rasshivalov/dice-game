import prompts from "prompts";
import { Utils } from "../../Utils";

export class UserInputHelper {
  private static validateIntegerInput(
    value: string,
    min: number,
    max: number
  ): true | string {
    if (Utils.isEmpty(value)) {
      return "Input cannot be empty.";
    }

    const num = Number(value);
    if (!Number.isInteger(num) || num < min || num > max) {
      return `Please enter an integer between ${min} and ${max}.`;
    }
    return true;
  }

  private static validateBit(value: string): true | string {
    if (Utils.isEmpty(value)) {
      return "Input cannot be empty.";
    }
    return value === "0" || value === "1" ? true : "Please enter 0 or 1.";
  }

  static async promptNumber(
    message: string,
    min: number,
    max: number
  ): Promise<number> {
    while (true) {
      const response = await prompts({
        type: "number",
        name: "number",
        message,
        validate: (value) =>
          Number.isInteger(value) && value >= min && value <= max
            ? true
            : `Please enter a number between ${min} and ${max}`,
      });

      const input = response.number;

      if (input === undefined || input === null || isNaN(input)) {
        console.log("No valid input provided. Please try again.");
        continue;
      }

      return input;
    }
  }

  static async promptBit(message: string): Promise<number> {
    while (true) {
      const response = await prompts({
        type: "text",
        name: "bit",
        message,
        validate: (value) => this.validateBit(value),
      });

      const input = response.bit;

      if (Utils.isEmpty(input)) {
        console.log("You entered nothing. Please try again.");
        continue;
      }

      if (input === "0" || input === "1") {
        return parseInt(input, 10);
      }

      console.log("Invalid input. Please try again.");
    }
  }

  static async promptConfirm(
    message: string,
    initial: boolean = true
  ): Promise<boolean> {
    const response = await prompts({
      type: "confirm",
      name: "value",
      message,
      initial,
    });

    return response.value === true;
  }
}
