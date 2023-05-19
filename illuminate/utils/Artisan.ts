import {
  base
} from "helpers";
import commands from "register/commands";
import ArtisanError from "illuminate/exceptions/utils/ArtisanError";

export default class Artisan {
  static call(args: string[], fromShell = true) {
    this.getCommand(args, fromShell)();
  }

  static getCommand(args: string[], fromShell = false): Function {
    const baseInput = args[0];
    let subCommand = '';
    const {
      params,
      flags
    } = this.parseArgs(args.splice(1));
    if (baseInput.includes(":")) {
      const [commandKey,
        subCommandTemp] = baseInput.split(":");
      subCommand = subCommandTemp;
      var CommandClass = require(base(`app/commands/${commands.nested?.[commandKey]}`)).default;
    } else {
      var CommandClass = require(base(`app/commands/${commands.invoked?.[baseInput]}`)).default;
    }

    var commandClass = new CommandClass(subCommand, fromShell, flags, params);
    const handler = commandClass[subCommand] || commandClass.handle;
    if (typeof handler === "undefined") throw ArtisanError.type("COMMAND_NOT_FOUND").create()
    return handler.bind(commandClass);
  }

  static parseArgs(args: string[]): {
    flags: string[],
    params: {[key: string]: string
    }} {
    const flags: string[] = [];
    const params: {[key: string]: string
    } = {};
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