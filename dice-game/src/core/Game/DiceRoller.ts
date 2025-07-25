import { FairRandomProtocol } from "../FairRandomProtocol";
import { Dice } from "../models/Dice";
import { UserInputHelper } from "./UserInputHelper";

export class DiceRoller {
  async rollDiceFairly(dice: Dice): Promise<number> {
    const protocol = new FairRandomProtocol(dice.getSides());
    const hmac = protocol.prepare();
    console.log(`Computer HMAC: ${hmac}`);

    const userInput = await UserInputHelper.promptNumber(
      `Enter your number (0 to ${dice.getSides() - 1}):`,
      0,
      dice.getSides() - 1
    );

    const result = protocol.reveal(userInput);
    console.log(`Computer number: ${result.computerNumber}`);
    console.log(`Secret: ${result.secret}`);
    console.log(`Final index (mod sum): ${result.result}`);

    const value = dice.getValueAt(result.result);
    console.log(`Rolled value: ${value}`);
    return value;
  }

  async rollDiceFairlyComputer(dice: Dice): Promise<number> {
    const protocol = new FairRandomProtocol(dice.getSides());
    const hmac = protocol.prepare();
    console.log(`Computer prepared roll (HMAC): ${hmac}`);

    const computerNumber = Math.floor(Math.random() * dice.getSides());
    console.log(`Computer randomly chose number (hidden): ${computerNumber}`);

    const result = protocol.reveal(computerNumber);
    console.log(`Computer secret revealed: ${result.secret}`);
    console.log(`Final index (mod sum): ${result.result}`);

    const value = dice.getValueAt(result.result);
    console.log(`Rolled value: ${value}`);

    return value;
  }
}
