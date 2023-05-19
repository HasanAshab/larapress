import { setEnv } from "helpers";
import Command from "illuminate/commands/Command";
import crypto from "crypto";

export default class GenerateSecret extends Command {
  handle(){
    const key = this.subCommand.toUpperCase() + "_SECRET";
    const secret = crypto.randomBytes(126).toString("hex");
    let obj = {};
    obj[key] = secret;
    setEnv(obj);
    this.success(`Secret generated: ${secret}`);
  };
}