"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const commander_1 = require("commander");
class Artisan {
    static call(commandArgs, fromShell = true) {
        if (typeof commandArgs !== 'undefined') {
            this.args = ['', '', ...commandArgs];
        }
        this.fromShell = fromShell;
        this.setup();
        this.artisan.parse(this.args);
    }
    static getCommand(commandArgs, fromShell = true) {
        if (typeof commandArgs !== 'undefined') {
            this.args = ['', '', ...commandArgs];
        }
        this.fromShell = fromShell;
        this.setup();
        return () => this.artisan.parse(this.args);
    }
    static setup() {
        this.artisan.name('Artisan').description('CLI for Express X Typescript project.\n Made by Samer Agency').version('0.0.1');
        const commands = require((0, helpers_1.base)('register/commands')).default;
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
    static registerCommand(name, actionPath, subCommand) {
        const ActionClass = require((0, helpers_1.base)(`app/commands/${actionPath}`)).default;
        const action = new ActionClass(subCommand, this.fromShell);
        const handler = action[subCommand || 'handle'] || action.handle;
        const args = (0, helpers_1.getParams)(handler);
        args.pop();
        const command = this.artisan.command(name).description(action.description || '');
        for (const arg of args) {
            command.argument(`<${arg}>`);
        }
        for (const option of action.options) {
            command.option(option.flag, option.message, option.default);
        }
        command.action(handler.bind(action));
    }
}
Artisan.artisan = new commander_1.Command();
Artisan.args = process.argv;
Artisan.fromShell = true;
exports.default = Artisan;
