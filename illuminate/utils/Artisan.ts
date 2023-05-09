import {
  base,
  getParams
} from 'helpers';
import ArtisanError from 'illuminate/exceptions/utils/ArtisanError';
import {
  Command
} from 'commander';

export default class Artisan {
  static artisan = new Command();
  static args = process.argv;
  static fromShell = true;

  static call(commandArgs?: string[], fromShell: boolean = true): void {
    if (typeof commandArgs !== 'undefined') {
      this.args = ['',
        '',
        ...commandArgs];
    }
    this.fromShell = fromShell;
    this.setup();
    this.artisan.parse(this.args);
  }

  static getCommand(commandArgs?: string[], fromShell: boolean = true): Function {
    if (typeof commandArgs !== 'undefined') {
      this.args = ['',
        '',
        ...commandArgs];
    }
    this.fromShell = fromShell;
    this.setup();
    return () => this.artisan.parse(this.args);
  }

  static setup(): void {
    this.artisan.name('Artisan').description('CLI for Express X Typescript project.\n Made by Samer Agency').version('0.0.1');
    const commands = require(base('register/commands')).default;
    if (typeof this.args[2] === 'undefined') {
      //TODO show help
    } else {
      if (this.args[2].includes(':')) {
        const [name,
          subCommand] = this.args[2].split(':');
        this.args[2] = name;
        const actionPath = commands[name];
        if (typeof actionPath === 'undefined') throw ArtisanError.type('COMMAND_NOT_FOUND').create();
        this.registerCommand(name, actionPath, subCommand);
      } else {
        const name = this.args[2]
        const actionPath = commands[name];
        if (typeof actionPath === 'undefined') throw ArtisanError.type('COMMAND_NOT_FOUND').create();
        this.registerCommand(name, actionPath);
      }
    }
  }

  static registerCommand(name: string, actionPath: string, subCommand?: string): void {
    const ActionClass = require(base(`app/commands/${actionPath}`)).default;
    const action = new ActionClass(subCommand, this.fromShell);
    const handler = action[subCommand || 'handle'] || action.handle;
    if (typeof handler === 'undefined') {
      throw ArtisanError.type('COMMAND_NOT_FOUND').create();
    }
    const args = getParams(handler);
    args.pop();
    const command = this.artisan.command(name).description(action.description || '')

    for (const arg of args) {
      command.argument(`<${arg}>`);
    }
    if (typeof action.options !== 'undefined') {
      for (const option of action.options) {
        command.option(option.flag, option.message, option.default)
      }
    }
    command.action(handler.bind(action));
  }
}