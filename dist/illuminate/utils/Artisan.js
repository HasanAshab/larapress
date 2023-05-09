"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const commander_1 = require("commander");
class Artisan {
    static setup() {
        this.artisan
            .name('Artisan')
            .description('CLI for Express X Typescript project.\n Made by Samer Agency')
            .version('0.0.1');
        const commands = require((0, helpers_1.base)('register/commands')).default;
        for (const [name, actionPath] of Object.entries(commands)) {
            if (typeof actionPath !== 'string') {
                continue;
            }
            const ActionClass = require((0, helpers_1.base)(actionPath)).default;
            const action = new ActionClass();
            const handler = action.handle;
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
    static call(args) {
        this.setup();
        this.artisan.parse(args);
    }
    static getCommand(commandArgs) {
        this.setup();
        return () => this.artisan.parse(['', '', ...commandArgs]);
    }
}
Artisan.artisan = new commander_1.Command();
exports.default = Artisan;
