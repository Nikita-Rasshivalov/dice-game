import { RandomGenerator } from "./RandomGenerator";
import { HmacGenerator } from "./HmacGenerator";

interface RevealResult {
  result: number;
  computerNumber: number;
  secret: string;
}

export class FairRandomProtocol {
  private secret!: Buffer;
  private computerNumber!: number;
  private hmac!: string;
  private prepared = false;

  constructor(private max: number) {
    if (!Number.isInteger(max) || max < 2) {
      throw new Error("FairRandomProtocol requires max >= 2");
    }
  }

  prepare(): string {
    if (this.prepared) {
      throw new Error(
        "Protocol already prepared. Create new instance to reuse."
      );
    }

    this.secret = RandomGenerator.generateKey();
    this.computerNumber = RandomGenerator.uniformInt(this.max);

    this.hmac = HmacGenerator.generateHmac(
      this.secret,
      this.computerNumber.toString()
    );

    this.prepared = true;
    return this.hmac;
  }
  reveal(userInput: number): RevealResult {
    if (!this.prepared) {
      throw new Error("Protocol not prepared. Call prepare() first.");
    }

    if (
      !Number.isInteger(userInput) ||
      userInput < 0 ||
      userInput >= this.max
    ) {
      throw new Error(
        `User input must be an integer between 0 and ${this.max - 1}`
      );
    }

    const result = (userInput + this.computerNumber) % this.max;

    this.prepared = false;

    return {
      result,
      computerNumber: this.computerNumber,
      secret: this.secret.toString("hex"),
    };
  }

  getHmac(): string {
    if (!this.prepared) {
      throw new Error("Protocol not prepared. Call prepare() first.");
    }
    return this.hmac;
  }

  static verifyHmac(secret: string, number: number, hmac: string): boolean {
    const computed = HmacGenerator.generateHmac(
      Buffer.from(secret, "hex"),
      number.toString()
    );
    return computed === hmac;
  }

  getMax(): number {
    return this.max;
  }
}
