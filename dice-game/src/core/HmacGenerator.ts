import { createHmac } from "crypto";

export class HmacGenerator {
  static generateHmac(secret: Buffer, message: string): string {
    if (!secret || !message) {
      throw new Error("HMAC generation requires both a secret and a message.");
    }

    return createHmac("sha3-256", secret).update(message).digest("hex");
  }
}
