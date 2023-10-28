import Command from "~/core/abstract/Command";
import crypto from "crypto";

export default class GenerateKey extends Command {
  static signature = "key:generate";
  
  async handle() {
    const secret = crypto.randomBytes(32).toString("hex");
    putEnv({ APP_KEY: secret });
    this.success(`Key generated: ${secret}`);
  }
}