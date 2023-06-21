import { setEnv } from "helpers";
import Command from "illuminate/commands/Command";
import crypto from "crypto";

export default class GenerateSecret extends Command {
  handle(){
    this.subCommandRequired("key");
    const key = this.subCommand.toUpperCase() + "_SECRET";
    const secret = crypto.randomBytes(32).toString("hex");
    setEnv({[key]: secret});  
    this.success(`Secret generated: ${secret}`);
  };
}