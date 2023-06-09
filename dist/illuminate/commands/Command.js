"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ArtisanError_1 = __importDefault(require("illuminate/exceptions/utils/ArtisanError"));
class Command {
    constructor(subCommand, fromShell = true, flags = [], params = {}) {
        this.subCommand = subCommand;
        this.fromShell = fromShell;
        this.flags = flags;
        this.params = params;
        this.subCommand = subCommand;
        this.fromShell = fromShell;
        this.flags = flags;
        this.params = params;
    }
    subCommandRequired(name) {
        if (typeof this.subCommand === "undefined") {
            throw ArtisanError_1.default.type("SUB_COMMAND_REQUIRED").create({ name });
        }
    }
    requiredParams(requiredParamsName) {
        for (const name of requiredParamsName) {
            if (typeof this.params[name] === "undefined") {
                throw ArtisanError_1.default.type("REQUIRED_PARAM_MISSING").create({ param: name });
            }
        }
    }
    info(text) {
        if (this.fromShell)
            console.log("\x1b[33m", text, "\x1b[0m");
    }
    success(text = "") {
        if (this.fromShell) {
            console.log("\x1b[32m", "\n", text, "\n", "\x1b[0m");
            process.exit(0);
        }
    }
    error(text = "") {
        if (this.fromShell) {
            console.log("\x1b[31m", "\n", text, "\n", "\x1b[0m");
            process.exit(1);
        }
    }
}
exports.default = Command;
