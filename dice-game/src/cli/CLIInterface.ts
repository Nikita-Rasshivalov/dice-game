import prompts from "prompts";
import { DiceParser } from "../core/models/DiceParser";
import { GameEngine } from "../core/Game/GameEngine";
import { ProbabilityCalculator } from "../core/ProbabilityCalculator";
import { TableRenderer } from "../core/TableRenderer";
import { MIN_DICE_COUNT } from "../constants";

export class CLIInterface {
  private diceList: any[] = [];

  async run() {
    await this.askForDiceConfig();
    this.printLoadedDice();

    while (true) {
      const command = await this.mainMenu();

      if (!command || command === "exit") {
        console.log("Goodbye!");
        break;
      }

      try {
        await this.handleCommand(command);
      } catch (err: any) {
        console.error("Error during command execution:", err.message);
      }
    }
  }

  private async askForDiceConfig(): Promise<void> {
    console.log("Welcome to the Fair Dice Game!");
    console.log("Enter at least 3 dice separated by spaces.");
    console.log(
      "Each die must be a comma-separated list of positive integers."
    );
    console.log("Example:");
    console.log("2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3\n");

    while (true) {
      const response = await prompts({
        type: "text",
        name: "input",
        message: "Enter all dice (space-separated):",
      });

      if (!response.input || response.input.trim() === "") {
        console.log("No input provided. Exiting.");
        return;
      }

      const diceStrings = response.input.trim().split(/\s+/);
      if (diceStrings.length < MIN_DICE_COUNT) {
        console.log(`Please enter at least ${MIN_DICE_COUNT} dice.`);
        continue;
      }

      try {
        this.diceList = DiceParser.parse(diceStrings);
        break;
      } catch (err: any) {
        console.error("Error parsing dice:", err.message);
      }
    }
  }

  private printLoadedDice() {
    console.log("\nLoaded dice:");
    this.diceList.forEach((dice, i) => {
      console.log(`  Dice #${i + 1}: ${dice.toString()}`);
    });
  }

  private async mainMenu(): Promise<string> {
    const response = await prompts({
      type: "select",
      name: "command",
      message: "Choose a command",
      choices: [
        { title: "Help", value: "help" },
        { title: "Show Probability Table", value: "table" },
        { title: "Play a Round", value: "play" },
        { title: "Exit", value: "exit" },
      ],
      initial: 0,
    });

    return response.command;
  }

  private async handleCommand(command: string) {
    switch (command) {
      case "help":
        console.log(
          "\nFair Dice Game Help:\n" +
            `- Enter at least ${MIN_DICE_COUNT} dice, separated by spaces.\n` +
            "  Each die must contain comma-separated positive integers.\n" +
            "- Commands:\n" +
            "  Help - show this message\n" +
            "  Show Probability Table - view win rates between dice\n" +
            "  Play a Round - select dice and roll fairly\n" +
            "  Exit - quit the game\n"
        );
        break;

      case "table":
        const matrix = ProbabilityCalculator.calculate(this.diceList);
        TableRenderer.render(matrix, this.diceList);
        break;

      case "play":
        const game = new GameEngine(this.diceList);
        await game.startGame();
        break;

      default:
        console.log(`Unknown command: ${command}`);
    }
  }
}
