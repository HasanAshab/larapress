const commands = require(base("register/commands"));

class Artisan {
  static call = (commandName, args = []) => {
    const command = Artisan.getCommand(commandName, false);
    if(command.length !== args.length){
      throw new Error('Invalid Argument Count!');
    }
    return command(...args);
  };

  static getCommand = (input, fromShell = true) => {
    if (input.includes(":")) {
      const [commandKey, subComand] = input.split(":");
      const CommandClass = require(base(commands.nested[commandKey]));
      var command = new CommandClass(undefined, fromShell)[subComand] || new CommandClass(subComand, fromShell).handle;
    } 
    else {
      const CommandClass = require(base(commands.invoked[input]));
      var command = new CommandClass(undefined, fromShell).handle;
    }
    return command;
  };
}

module.exports = Artisan;
