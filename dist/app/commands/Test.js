"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("illuminate/commands/Command"));
//const User = require(base("app/models/User"));
//const DB = require(base("illuminate/utils/DB"));
class Test extends Command_1.default {
    constructor() {
        super(...arguments);
        this.description = 'this is test';
        this.options = [
            {
                flag: '-p, --port <port>',
                message: 'Port to run the app',
                default: 8000
            }
        ];
    }
    async handle(foo, bar, options) {
        this._greet();
        this.success('Yeh!');
        console.log(foo, bar, options);
        console.log(this.subCommand);
    }
    ;
    async other(a, options) {
        console.log(a, options);
        console.log(this.subCommand);
    }
    ;
    _greet() {
        console.log('hello');
    }
}
exports.default = Test;
