import { base, getParams } from 'helpers';
import { Command } from 'commander';

export default class Artisan {
  static artisan = new Command();
  
  
  static setup(): void {
    this.artisan
    .name('Artisan')
    .description('CLI for Express X Typescript project.\n Made by Samer Agency')
    .version('0.0.1');
    const commands = require(base('register/commands')).default;

    for (const [name, actionPath] of Object.entries(commands)) {
      if (typeof actionPath !== 'string') {
        continue;
      }
      const ActionClass = require(base(actionPath)).default;
      const action = new ActionClass();
      const handler = action.handle;
      const args = getParams(handler);
      args.pop();
      const command = this.artisan.command(name).description(action.description || '')

      for (const arg of args) {
        command.argument(`<${arg}>`);
      }

      for (const option of action.options) {
        command.option(option.flag, option.message, option.default)
      }
      command.action(handler);
    }
  }

  static call(args?: string[]): void {
    this.setup();
    this.artisan.parse(args);
  }
  
  static getCommand(commandArgs: string[]): Function {
    this.setup();
    return () => this.artisan.parse(['', '', ...commandArgs]);
  }
}