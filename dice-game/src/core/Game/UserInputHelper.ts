import prompts from "prompts";

export class UserInputHelper {
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

      if (response.number === undefined) {
        console.log("Input cancelled.");
        process.exit(1);
      }

      return response.number;
    }
  }

  static async promptBit(message: string): Promise<number> {
    while (true) {
      const response = await prompts({
        type: "text",
        name: "bit",
        message,
        validate: (value) =>
          value === "0" || value === "1" ? true : "Please enter 0 or 1",
      });

      if (response.bit === undefined) {
        console.log("Input cancelled.");
        process.exit(1);
      }

      if (response.bit === "0" || response.bit === "1") {
        return parseInt(response.bit, 10);
      }
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
