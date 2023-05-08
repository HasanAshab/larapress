import { isClass } from "helpers";
import commands from "register/commands";
import ArtisanError from "illuminate/exceptions/utils/ArtisanError";

type Params = {[key: string]: string};

export default class Artisan {
  static async call(args: string[], fromShell = true): Promise<void> {
    const baseInput = args[0];
    const { params, flags } = this.parseArgs(args.splice(1));
    
    if (baseInput.includes(":")) {
      const [commandKey, subCommand] = baseInput.split(":");
      const CommandClass = await import(commands.nested[commandKey]);
  
      if (!isClass(CommandClass)) {
        throw ArtisanError.type("COMMAND_NOT_FOUND").create();
      }
  
      const commandClass = new CommandClass();
      commandClass.subCommand = subCommand;
      commandClass.fromShell = fromShell;
      commandClass.flags = flags;
      commandClass.params = params;
  
      if (commandClass[subCommand]) {
        commandClass[subCommand]();
      } else {
        commandClass.handle();
      }
    } else {
      const CommandClass = await import(commands.invoked[baseInput]);
  
      if (!isClass(CommandClass)) {
        throw ArtisanError.type("COMMAND_NOT_FOUND").create();
      }
  
      const commandClass = new CommandClass();
      commandClass.fromShell = fromShell;
      commandClass.flags = flags;
      commandClass.params = params;
  
      if (commandClass[baseInput]) {
        commandClass[baseInput]();
      } else {
        commandClass.handle();
      }
    }
  }

  
  static getCommand(input: string, fromShell: boolean = false): string {
    const command = (): Promise<void> => this.call(input.split(' '), fromShell);
    return command.toString();
  }

  static parseArgs(args: string[]): {params: Params, flags: string[]} {
    const params: Params = {};
    const flags: string[] = [];
    args.forEach((arg, index) => {
      if (arg.startsWith("--")) {
        flags.push(arg.replace("--", ""));
      } else if (arg.includes("=")) {
        const [key, value] = arg.split("=");
        params[key] = value;
      }
    });
    return { params, flags };
  }
}