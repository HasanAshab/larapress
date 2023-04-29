const commands = require(base('register/commands'));
const ArtisanError = require(base("app/exceptions/ArtisanError"));

class Artisan {
  static call = (input) => {
    return Artisan.getCommand(input, false)();
  }

  static getCommand = (args, fromShell = true) => {
    const { params, flags } = Artisan.parseArgs(args);

    if (!Array.isArray(params)) {
      params = params.split(' ');
    }
    if (params[0].includes(':')) {
      const [commandKey, subComand] = params[0].split(':');
      const CommandClass = require(base(commands.nested[commandKey]));
      if (!isClass(CommandClass)) {
        new ArtisanError().throw('COMMAND_NOT_FOUND');
      }
      var command =
        new CommandClass(undefined, fromShell, flags)[subComand] ||
        new CommandClass(subComand, fromShell, flags).handle;
    } else {
      const CommandClass = require(base(commands.invoked[params[0]]));
      if (!isClass(CommandClass)) {
        new ArtisanError().throw('COMMAND_NOT_FOUND');
      }
      var command = new CommandClass(undefined, fromShell, flags).handle;
    }
    if (command.length !== params.length - 1) {
      new ArtisanError().throw('INVALID_ARG_COUNT');
    }
    return command.bind(...params);
  }
  
  static parseArgs(args){
    const flags = {};
    const params = [];
    args.forEach((arg, index) => {
      if(arg.startsWith('--')){
        const [key, value] = arg.replace('--', '').split('=');
        flags[key] = value ? value : true;
      }
      else{
        params.push(arg);
      }
    });
    return { params, flags };
  }
}

module.exports = Artisan;
