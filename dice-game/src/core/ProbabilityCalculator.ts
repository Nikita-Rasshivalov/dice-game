import { Dice } from "./models/Dice";

export class ProbabilityCalculator {
  static calculate(diceList: Dice[]): {
    wins: number[][];
    draws: number[][];
    losses: number[][];
  } {
    const n = diceList.length;
    const wins: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const draws: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const losses: number[][] = Array.from({ length: n }, () =>
      Array(n).fill(0)
    );

    for (let i = 0; i < n; i++) {
      const aValues = diceList[i].getValues();
      for (let j = 0; j < n; j++) {
        if (i === j) {
          wins[i][j] = -1;
          draws[i][j] = -1;
          losses[i][j] = -1;
          continue;
        }

        const bValues = diceList[j].getValues();
        let winCount = 0;
        let drawCount = 0;
        let lossCount = 0;

        for (const a of aValues) {
          for (const b of bValues) {
            if (a > b) winCount++;
            else if (a === b) drawCount++;
            else lossCount++;
          }
        }

        const total = aValues.length * bValues.length;

        wins[i][j] = parseFloat(((winCount / total) * 100).toFixed(2));
        draws[i][j] = parseFloat(((drawCount / total) * 100).toFixed(2));
        losses[i][j] = parseFloat(((lossCount / total) * 100).toFixed(2));
      }
    }

    return { wins, draws, losses };
  }
}
