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
const utils_1 = require("illuminate/utils");
//import Artisan from "illuminate/utils/Artisan";
const events_1 = __importDefault(require("register/events"));
class Setup {
    /*
    static cronJobs(): void {
      for (const [command, schedule] of Object.entries(crons)) {
        nodeCron.schedule(schedule, Artisan.getCommand(command));
      }
    };
    */
    static async events(app) {
        for (const [event, listenerNames] of Object.entries(events_1.default)) {
            for (const listenerName of listenerNames) {
                const listener = await Promise.resolve(`${`app/listeners/${listenerName}`}`).then(s => __importStar(require(s)));
                app.on(event, listener.dispatch);
            }
        }
    }
    ;
    static routes(app) {
        const routesRootPath = (0, helpers_1.base)("routes");
        (0, utils_1.generateEndpointsFromDirTree)(routesRootPath, async (endpoint, path) => {
            app.use(endpoint, await Promise.resolve(`${path}`).then(s => __importStar(require(s))));
        });
    }
    ;
}
exports.default = Setup;
