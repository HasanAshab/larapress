import { base, getParams } from 'helpers';
import { Command } from 'commander';

export default class Artisan {
  static artisan = new Command();
  static args = process.argv;

  static call(args?: string[]): void {
    if(typeof args !== 'undefined'){
      this.args = args;
    }
    this.setup();
    this.artisan.parse(this.args);
  }

  static getCommand(commandArgs: string[]): Function {
    this.args = ['', '', ...commandArgs];
    this.setup();
    return () => this.artisan.parse(this.args);
  }

  static setup(): void {
    this.artisan.name('Artisan').description('CLI for Express X Typescript project.\n Made by Samer Agency').version('0.0.1');
    const commands = require(base('register/commands')).default;
    const [name, subCommand] = this.args[2].split(':');
    if (typeof commands[name] === 'string') {
      this.args[2] = name;
      this.registerCommand(name, commands[name], subCommand);
    }
    else {
      for (const [name, actionPath] of Object.entries(commands)) {
        if (typeof actionPath === 'string') {
          this.registerCommand(name, actionPath);
        }
      }
    }
  }

  static registerCommand(name: string, actionPath: string, subCommand?: string): void {
    const ActionClass = require(base(`app/commands/${actionPath}`)).default;
    const action = new ActionClass();
    const handler = action[subCommand || 'handle'] || action.handle;
    const args = getParams(handler);
    args.pop();
    const command = this.artisan.command(name).description(action.description || '')

    for (const arg of args) {
      command.argument(`<${arg}>`);
    }

    for (const option of action.options) {
      command.option(option.flag, option.message, option.default)
    }
    command.action(handler.bind(action));
  }
}