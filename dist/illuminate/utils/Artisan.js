"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const commands_1 = __importDefault(require("register/commands"));
const ArtisanError_1 = __importDefault(require("illuminate/exceptions/utils/ArtisanError"));
class Artisan {
    static async call(args, fromShell = true) {
        const baseInput = args[0];
        const { params, flags } = this.parseArgs(args.splice(1));
        if (baseInput.includes(":")) {
            const [commandKey, subCommand] = baseInput.split(":");
            const CommandClass = await Promise.resolve(`${commands_1.default.nested[commandKey]}`).then(s => __importStar(require(s)));
            if (!(0, helpers_1.isClass)(CommandClass)) {
                throw ArtisanError_1.default.type("COMMAND_NOT_FOUND").create();
            }
            const commandClass = new CommandClass();
            commandClass.subCommand = subCommand;
            commandClass.fromShell = fromShell;
            commandClass.flags = flags;
            commandClass.params = params;
            if (commandClass[subCommand]) {
                commandClass[subCommand]();
            }
            else {
                commandClass.handle();
            }
        }
        else {
            const CommandClass = await Promise.resolve(`${commands_1.default.invoked[baseInput]}`).then(s => __importStar(require(s)));
            if (!(0, helpers_1.isClass)(CommandClass)) {
                throw ArtisanError_1.default.type("COMMAND_NOT_FOUND").create();
            }
            const commandClass = new CommandClass();
            commandClass.fromShell = fromShell;
            commandClass.flags = flags;
            commandClass.params = params;
            if (commandClass[baseInput]) {
                commandClass[baseInput]();
            }
            else {
                commandClass.handle();
            }
        }
    }
    static getCommand(input, fromShell = false) {
        const command = () => this.call(input.split(' '), fromShell);
        return command.toString();
    }
    static parseArgs(args) {
        const params = {};
        const flags = [];
        args.forEach((arg, index) => {
            if (arg.startsWith("--")) {
                flags.push(arg.replace("--", ""));
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
