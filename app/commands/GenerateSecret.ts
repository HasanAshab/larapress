import { setEnv } from "helpers";
import Command from "illuminate/commands/Command";
import crypto from "crypto";

export default class GenerateSecret extends Command {
  handle(){
    const targetKey = this.subCommandRequired("key");
    const key = targetKey.toUpperCase() + "_SECRET";
    const secret = crypto.randomBytes(126).toString("hex");
    setEnv({[key]: secret});
    this.success(`Secret generated: ${secret}`);
  };
}