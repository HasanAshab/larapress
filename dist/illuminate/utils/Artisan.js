"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const ArtisanError_1 = __importDefault(require("illuminate/exceptions/utils/ArtisanError"));
const commander_1 = require("commander");
class Artisan {
    static call(commandArgs, fromShell = true) {
        if (typeof commandArgs !== 'undefined') {
            this.args = ['',
                '',
                ...commandArgs];
        }
        this.fromShell = fromShell;
        this.setup();
        this.artisan.parse(this.args);
    }
    static getCommand(commandArgs, fromShell = true) {
        if (typeof commandArgs !== 'undefined') {
            this.args = ['',
                '',
                ...commandArgs];
        }
        this.fromShell = fromShell;
        this.setup();
        return () => this.artisan.parse(this.args);
    }
    static setup() {
        this.artisan.name('Artisan').description('CLI for Express X Typescript project.\n Made by Samer Agency').version('0.0.1');
        const commands = require((0, helpers_1.base)('register/commands')).default;
        if (typeof this.args[2] === 'undefined') {
            //TODO show help
        }
        else {
            if (this.args[2].includes(':')) {
                const [name, subCommand] = this.args[2].split(':');
                this.args[2] = name;
                const actionPath = commands[name];
                if (typeof actionPath === 'undefined')
                    throw ArtisanError_1.default.type('COMMAND_NOT_FOUND').create();
                this.registerCommand(name, actionPath, subCommand);
            }
            else {
                const name = this.args[2];
                const actionPath = commands[name];
                if (typeof actionPath === 'undefined')
                    throw ArtisanError_1.default.type('COMMAND_NOT_FOUND').create();
                this.registerCommand(name, actionPath);
            }
        }
    }
    static registerCommand(name, actionPath, subCommand) {
        const ActionClass = require((0, helpers_1.base)(`app/commands/${actionPath}`)).default;
        const action = new ActionClass(subCommand, this.fromShell);
        const handler = action[subCommand || 'handle'] || action.handle;
        if (typeof handler === 'undefined') {
            throw ArtisanError_1.default.type('COMMAND_NOT_FOUND').create();
        }
        const args = (0, helpers_1.getParams)(handler);
        args.pop();
        const command = this.artisan.command(name).description(action.description || '');
        for (const arg of args) {
            command.argument(`<${arg}>`);
        }
        if (typeof action.options !== 'undefined') {
            for (const option of action.options) {
                command.option(option.flag, option.message, option.default);
            }
        }
        command.action(handler.bind(action));
    }
}
Artisan.artisan = new commander_1.Command();
Artisan.args = process.argv;
Artisan.fromShell = true;
exports.default = Artisan;
