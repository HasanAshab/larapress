"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import { generateEndpointsFromDirTree } from "illuminate/utils";
const helpers_1 = __importDefault(require("helpers"));
//import Artisan from "illuminate/utils/Artisan";
//import events from "register/events";
//import crons from "register/cron";
class Setup {
    static helpers() {
        for (const [name, helper] of Object.entries(helpers_1.default)) {
            globalThis[name] = helper;
        }
    }
}
exports.default = Setup;
