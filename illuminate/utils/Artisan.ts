import { base } from "helpers";
import commands from "register/commands";

export default class Artisan {
  static call(args: string[], fromShell = true) {
    const baseInput = args[0];
    let subCommand: string | undefined = undefined;
    const { params, flags } = this.parseArgs(args.splice(1));
    if (baseInput.includes(":")) {
      const [commandKey, subCommandTemp] = baseInput.split(":");
      subCommand = subCommandTemp;
      var CommandClass = require(base(commands.nested[commandKey])).default;
     /* if (!isClass(CommandClass)) {
        throw ArtisanError.type("COMMAND_NOT_FOUND").create();
      }*/
    } else {
      var CommandClass = require(base(`app/commands/${commands.invoked[baseInput]}`)).default;
     /* if (!isClass(CommandClass)) {
        throw ArtisanError.type("COMMAND_NOT_FOUND").create();
      }*/
    }

    var commandClass = new CommandClass(subCommand, fromShell, flags, params);
    const handle = commandClass[subCommand || "handle"];
    if (typeof handle === "function") handle.apply(commandClass);
    else console.log('nope')
  }
  /*
  static getCommand(input, fromShell = false){
    return () => this.call(input.split(' '), fromShell);
  }
  */
  static parseArgs(args: string[]): {flags: string[], params: {[key: string]: string}} {
    const flags: string[] = [];
    const params: {[key: string]: string} = {};
    args.forEach((arg, index) => {
      if (arg.startsWith("-")) {
        flags.push(arg.replace("-", ""));
      } else if (arg.includes("=")) {
        const [key, value] = arg.split("=");
        params[key] = value;
      }
    });
    return { params, flags };
  }
}
