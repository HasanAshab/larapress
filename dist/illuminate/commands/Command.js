"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
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
            throw (0, helpers_1.customError)("SUB_COMMAND_REQUIRED", { name });
        }
    }
    requiredParams(requiredParamsName) {
        for (const name of requiredParamsName) {
            if (typeof this.params[name] === "undefined") {
                throw (0, helpers_1.customError)("REQUIRED_PARAM_MISSING", { param: name });
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
