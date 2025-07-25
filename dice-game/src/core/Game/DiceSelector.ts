import { FairRandomProtocol } from "../FairRandomProtocol";
import { Dice } from "../models/Dice";
import { UserInputHelper } from "./UserInputHelper";

export class DiceSelector {
  constructor(private diceList: Dice[]) {}

  printDiceOptions() {
    console.log("Available dice:");
    this.diceList.forEach((dice, idx) => {
      console.log(`${idx + 1}. ${dice.toString()}`);
    });
  }

  async selectUserDice(excludeIndex: number = -1): Promise<number> {
    if (this.diceList.length === 0) {
      throw new Error("No dice available to select.");
    }

    this.printDiceOptions();

    while (true) {
      const choice = await UserInputHelper.promptNumber(
        `Select your dice (1-${this.diceList.length}):`,
        1,
        this.diceList.length
      );
      if (choice - 1 !== excludeIndex) return choice - 1;
      console.log(
        `You cannot choose dice number ${excludeIndex + 1}. Try again.`
      );
    }
  }

  async selectComputerDiceFair(excludeIndex: number = -1): Promise<number> {
    const available = this.diceList
      .map((_, idx) => idx)
      .filter((i) => i !== excludeIndex);

    if (available.length === 0) {
      throw new Error("No dice available for computer to select.");
    }

    const protocol = new FairRandomProtocol(available.length);
    const hmac = protocol.prepare();
    console.log(`Computer is selecting a dice (HMAC): ${hmac}`);

    const userInput = await UserInputHelper.promptNumber(
      `Enter your number (0 to ${
        available.length - 1
      }) to participate in fair selection:`,
      0,
      available.length - 1
    );

    const result = protocol.reveal(userInput);
    console.log(`Computer secret revealed: ${result.secret}`);
    console.log(`Final result index: ${result.result}`);

    const chosenDiceIndex = available[result.result];
    console.log(
      `Computer selected dice: ${this.diceList[chosenDiceIndex].toString()}`
    );

    return chosenDiceIndex;
  }
}
