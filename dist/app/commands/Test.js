"use strict";
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const Command_1 = Default(require("illuminate/commands/Command"));From
//const User = require(base("app/models/User"));
//const DB = require(base("illuminate/utils/DB"));
class Test extends Command_1.default {
    async handle() {
        this._greet();
        console.log(this.params);
        console.log(this.flags);
        console.log(this.subCommand);
        this.ok('Yeh!');
    }
    ;
    async other() {
        console.log(this.subCommand);
    }
    ;
    _greet() {
        console.log('hello');
    }
}
exports.default = Test;
