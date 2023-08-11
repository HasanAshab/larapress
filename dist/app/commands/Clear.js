"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("illuminate/commands/Command"));
const child_process_1 = require("child_process");
class Clear extends Command_1.default {
    uploads() {
        (0, child_process_1.execSync)("rm -r storage/public/uploads");
        (0, child_process_1.execSync)("mkdir  storage/public/uploads");
        this.success("Uploads are cleared now!");
    }
    reports() {
        this.requiredParams(["name"]);
        const { name } = this.params;
        (0, child_process_1.execSync)("rm -r storage/reports/" + name);
        (0, child_process_1.execSync)("mkdir  storage/reports/" + name);
        this.success(name + " reports are clear now!");
    }
}
exports.default = Clear;
