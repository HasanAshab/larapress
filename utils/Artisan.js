const commands = require(base("register/commands"));

class Artisan {
  static call = (input) => {
    return Artisan.getCommand(input, false)();
  }

  static getCommand = (args, fromShell = true) => {
    const { params, flags } = Artisan.parseArgs(args);

    if (!Array.isArray(params)) {
      params = params.split(" ");
    }
    if (params[0].includes(":")) {
      const [commandKey, subComand] = params[0].split(":");
      const CommandClass = require(base(commands.nested[commandKey]));
      if (!isClass(CommandClass)) {
        throw new Error("Command not found!");
      }
      var command =
        new CommandClass(undefined, fromShell, flags)[subComand] ||
        new CommandClass(subComand, fromShell, flags).handle;
    } else {
      const CommandClass = require(base(commands.invoked[params[0]]));
      if (!isClass(CommandClass)) {
        throw new Error("Command not found!");
      }
      var command = new CommandClass(undefined, fromShell, flags).handle;
    }
    if (command.length !== params.length - 1) {
      throw new Error("Number of Argument is Invalid!");
    }
    return command.bind(...params);
  }
  
  static parseArgs(args){
    const flags = [];
    const params = [];
    args.map((arg) => {
      if(arg.startsWith('--')){
        flags.push(arg.replace('--', ''));
      }
      else{
        params.push(arg);
      }
    });
    return { params, flags };
  }
}

module.exports = Artisan;
