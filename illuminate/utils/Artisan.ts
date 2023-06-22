import { ArtisanBaseInput } from "types" 
import {
  base
} from "helpers";
import commands from "register/commands";
import ArtisanError from "illuminate/exceptions/utils/ArtisanError";


export default class Artisan {
  static async call(baseInput: ArtisanBaseInput, args: string[], fromShell = true): Promise<Function> {
    const { params, flags } = this.parseArgs(args);
    const [commandKey, subCommand] = baseInput.split(":");
    const commandName = commands[commandKey as keyof typeof commands];
    if (typeof commandName === "undefined") throw ArtisanError.type("COMMAND_NOT_FOUND").create()

    const CommandClass = require(base(`app/commands/${commandName}`))?.default;

    const commandClass = new CommandClass(subCommand, fromShell, flags, params);
    const handler = commandClass[subCommand] || commandClass.handle;
    if (typeof handler === "undefined") throw ArtisanError.type("COMMAND_NOT_FOUND").create()
    return handler.apply(commandClass);
  }

  static parseArgs(args: string[]): {
    flags: string[],
    params: Record<string, string>
  } {
    const flags: string[] = [];
    const params: Record<string, string> = {};
    args.forEach((arg, index) => {
      if (arg.startsWith("-")) {
        flags.push(arg.replace("-", ""));
      } else if (arg.includes("=")) {
        const [key,
          value] = arg.split("=");
        params[key] = value;
      }
    });
    return {
      params, flags
    };
  }
}