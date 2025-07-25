import { DiceSelector } from "./DiceSelector";
import { DiceRoller } from "./DiceRoller";
import { UserInputHelper } from "./UserInputHelper";
import { FairRandomProtocol } from "../FairRandomProtocol";
import { Dice } from "../models/Dice";

export class GameEngine {
  private diceSelector: DiceSelector;
  private diceRoller: DiceRoller;

  constructor(private diceList: Dice[]) {
    this.diceSelector = new DiceSelector(diceList);
    this.diceRoller = new DiceRoller();
  }

  async startGame(): Promise<void> {
    const first = await this.determineFirstPlayer();

    let userDiceIndex: number;
    let computerDiceIndex: number;

    if (first === 0) {
      console.log("\nYou go first!");
      userDiceIndex = await this.diceSelector.selectUserDice();
      computerDiceIndex = await this.diceSelector.selectComputerDiceFair(
        userDiceIndex
      );
    } else {
      console.log("\nComputer goes first!");
      computerDiceIndex = await this.diceSelector.selectComputerDiceFair(-1);
      userDiceIndex = await this.diceSelector.selectUserDice();

      if (userDiceIndex === computerDiceIndex) {
        console.log("You cannot choose the same dice. Try again.");
        userDiceIndex = await this.diceSelector.selectUserDice();
      }
    }

    await this.playRound(userDiceIndex, computerDiceIndex);

    if (
      await UserInputHelper.promptConfirm(
        "Would you like to play another round?"
      )
    ) {
      await this.startGame();
    } else {
      console.log("Thanks for playing!");
    }
  }

  private async determineFirstPlayer(): Promise<number> {
    const protocol = new FairRandomProtocol(2);
    console.log("Determining who goes first...");
    const hmac = protocol.prepare();
    console.log(`HMAC: ${hmac}`);

    const userBit = await UserInputHelper.promptBit("Enter 0 or 1:");

    const result = protocol.reveal(userBit);
    console.log(`Computer number: ${result.computerNumber}`);
    console.log(`Secret: ${result.secret}`);
    console.log(
      `Result (0 - you start, 1 - computer starts): ${result.result}`
    );

    return result.result;
  }

  private async playRound(
    userDiceIndex: number,
    computerDiceIndex: number
  ): Promise<void> {
    console.log("\n--- Your Roll ---");
    const userValue = await this.diceRoller.rollDiceFairly(
      this.diceList[userDiceIndex]
    );

    console.log("\n--- Computer's Roll ---");
    const computerValue = await this.diceRoller.rollDiceFairlyComputer(
      this.diceList[computerDiceIndex]
    );

    console.log(`\nYour roll: ${userValue}`);
    console.log(`Computer roll: ${computerValue}`);

    if (userValue > computerValue) {
      console.log("You win!");
    } else if (userValue < computerValue) {
      console.log("You lose.");
    } else {
      console.log("It's a tie.");
    }
  }
}
