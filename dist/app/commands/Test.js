"use strict";
//const Command = require(base("illuminate/commands/Command"));
//const User = require(base("app/models/User"));
//const DB = require(base("illuminate/utils/DB"));
Object.defineProperty(exports, "__esModule", { value: true });
class Test {
    constructor() {
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
        console.log(foo, bar, options);
    }
    ;
}
exports.default = Test;
