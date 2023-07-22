import Command from "illuminate/commands/Command";
import { env } from "helpers";
import crypto from "crypto";

export default class Key extends Command {
  async generate() {
    const secret = crypto.randomBytes(32).toString("hex");
    env({
      APP_KEY: secret
    });
    this.success(`Key generated: ${secret}`);
  }
}