"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("illuminate/commands/Command"));
class Test extends Command_1.default {
    async handle() {
        console.log(this.params);
    }
}
exports.default = Test;
