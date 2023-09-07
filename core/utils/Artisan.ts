import { ArtisanBaseInput } from "types" 
import commands from "~/register/commands";

export default class Artisan {
  static async call(baseInput: ArtisanBaseInput, args: string[], fromShell = true) {
    const { params, flags } = this.parseArgs(args);
    const [commandKey, subCommand] = baseInput.split(":");
    const commandName = commands[commandKey as keyof typeof commands];
    if (!commandName) throw new Error("Command not found!");

    const { default: CommandClass } = await import(`~/app/commands/${commandName}`);

    const commandClass = new CommandClass(subCommand, fromShell, flags, params);
    const handler = commandClass[subCommand] || commandClass.handle;
    if (!handler) throw new Error("Command not found!");
    try {
      await handler.apply(commandClass);
    }
    catch(err: any) {
      if(commandClass.onError) {
        commandClass.onError(err);
      }
      throw err;
    }
  }

  static parseArgs(args: string[]) {
    const flags: string[] = [];
    const params: Record<string, string> = {};
    args.forEach((arg, index) => {
      if (arg.startsWith("-")) {
        flags.push(arg.replace("-", ""));
      } else if (arg.includes("=")) {
        const [key, value] = arg.split("=");
        params[key] = value;
      }
    });
    return {
      params, flags
    };
  }
}