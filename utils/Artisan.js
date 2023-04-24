const commands = require(base("register/commands"));

class Artisan {
  static call = (input) => {
    return Artisan.getCommand(input, false)();
  };

  static getCommand = (args, fromShell = true) => {
    if (!Array.isArray(args)) {
      args = args.split(" ");
    }
    if (args[0].includes(":")) {
      const [commandKey, subComand] = args[0].split(":");
      const CommandClass = require(base(commands.nested[commandKey]));
      if (!isClass(CommandClass)) {
        throw new Error("Command not found!");
      }
      var command =
        new CommandClass(undefined, fromShell)[subComand] ||
        new CommandClass(subComand, fromShell).handle;
    } else {
      const CommandClass = require(base(commands.invoked[args[0]]));
      if (!isClass(CommandClass)) {
        throw new Error("Command not found!");
      }
      var command = new CommandClass(undefined, fromShell).handle;
    }
    if (command.length !== args.length - 1) {
      throw new Error("Number of Argument is Invalid!");
    }
    return command.bind(...args);
  };
}

module.exports = Artisan;
