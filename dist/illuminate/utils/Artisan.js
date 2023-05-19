"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const commands_1 = __importDefault(require("register/commands"));
class Artisan {
    static call(args, fromShell = true) {
        const baseInput = args[0];
        let subCommand = undefined;
        const { params, flags } = this.parseArgs(args.splice(1));
        if (baseInput.includes(":")) {
            const [commandKey, subCommandTemp] = baseInput.split(":");
            subCommand = subCommandTemp;
            var CommandClass = require((0, helpers_1.base)(commands_1.default.nested[commandKey])).default;
            /* if (!isClass(CommandClass)) {
               throw ArtisanError.type("COMMAND_NOT_FOUND").create();
             }*/
        }
        else {
            var CommandClass = require((0, helpers_1.base)(`app/commands/${commands_1.default.invoked[baseInput]}`)).default;
            /* if (!isClass(CommandClass)) {
               throw ArtisanError.type("COMMAND_NOT_FOUND").create();
             }*/
        }
        var commandClass = new CommandClass(subCommand, fromShell, flags, params);
        const handle = commandClass[subCommand || "handle"];
        if (typeof handle === "function")
            handle.apply(commandClass);
        else
            console.log('nope');
    }
    /*
    static getCommand(input, fromShell = false){
      return () => this.call(input.split(' '), fromShell);
    }
    */
    static parseArgs(args) {
        const flags = [];
        const params = {};
        args.forEach((arg, index) => {
            if (arg.startsWith("-")) {
                flags.push(arg.replace("-", ""));
            }
            else if (arg.includes("=")) {
                const [key, value] = arg.split("=");
                params[key] = value;
            }
        });
        return { params, flags };
    }
}
exports.default = Artisan;
