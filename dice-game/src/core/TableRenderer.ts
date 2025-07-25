import Table from "cli-table3";
import { green, blue, white, gray, bold, yellow, red } from "colorette";
import { Dice } from "./models/Dice";

export class TableRenderer {
  static render(
    probabilities: { wins: number[][]; draws: number[][]; losses: number[][] },
    diceList: Dice[]
  ): void {
    const diceCount = diceList.length;
    const headers = [" "].concat(diceList.map((_, i) => blue(`Dice ${i + 1}`)));

    const table = new Table({
      head: headers,
      style: { head: [], border: [] },
      colWidths: headers.map(() => 20),
      wordWrap: true,
    });

    for (let i = 0; i < diceCount; i++) {
      const row = [
        green(`Dice ${i + 1}`),
        ...Array(diceCount)
          .fill(0)
          .map((_, j) => {
            if (i === j) return gray("-");

            const win = probabilities.wins[i][j];
            const draw = probabilities.draws[i][j];
            const loss = probabilities.losses[i][j];

            return (
              white(`Win: ${win.toFixed(2)}%\n`) +
              yellow(`Draw: ${draw.toFixed(2)}%\n`) +
              red(`Loss: ${loss.toFixed(2)}%`)
            );
          }),
      ];
      table.push(row);
    }

    console.log(bold("\nProbability Table (Dice i vs Dice j):"));
    console.log(table.toString());
    console.log(
      gray(
        "Note: Diagonal values are ignored (dice can't play against itself)."
      )
    );
  }
}
