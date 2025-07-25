import { randomInt, randomBytes } from "crypto";

export class RandomGenerator {
  static uniformInt(max: number): number {
    if (!Number.isInteger(max) || max <= 0) {
      throw new Error("Max must be a positive integer.");
    }
    return randomInt(max);
  }

  static generateKey(bytes: number = 32): Buffer {
    if (!Number.isInteger(bytes) || bytes <= 0) {
      throw new Error("Byte length must be a positive integer.");
    }
    return randomBytes(bytes);
  }
}
