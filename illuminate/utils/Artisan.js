const commands = require(base("register/commands"));
const ArtisanError = require(base("illuminate/exceptions/utils/ArtisanError"));

class Artisan {
  static call(args, fromShell = true) {
    const baseInput = args[0];
    const { params, flags } = this.parseArgs(args.splice(1));
    if (baseInput.includes(":")) {
      var [commandKey, subCommand] = baseInput.split(":");
      var CommandClass = require(base(commands.nested[commandKey]));
      if (!isClass(CommandClass)) {
        throw ArtisanError.type("COMMAND_NOT_FOUND").create();
      }
    } else {
      var CommandClass = require(base(commands.invoked[baseInput]));
      if (!isClass(CommandClass)) {
        throw ArtisanError.type("COMMAND_NOT_FOUND").create();
      }
    }
    var commandClass = new CommandClass();
    commandClass.subCommand = subCommand;
    commandClass.fromShell = fromShell;
    commandClass.flags = flags;
    commandClass.params = params;
    if (commandClass[subCommand]) {
      return commandClass[subCommand]();
    } else {
      return commandClass.handle();
    }
  }

  static parseArgs(args) {
    const flags = [];
    const params = {};
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

module.exports = Artisan;
