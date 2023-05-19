"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const utils_1 = require("illuminate/utils");
const events_1 = __importDefault(require("register/events"));
class Setup {
    /*
    static cronJobs(): void {
      for (const [command, schedule] of Object.entries(crons)) {
        nodeCron.schedule(schedule, Artisan.getCommand(command.split(' ')) as ((now: Date | "init" | "manual") => void));
      }
    };
  */
    static events(app) {
        for (const [event, listenerNames] of Object.entries(events_1.default)) {
            for (const listenerName of listenerNames) {
                const Listener = require((0, helpers_1.base)(`app/listeners/${listenerName}`)).default;
                const listenerInstance = new Listener();
                app.on(event, listenerInstance.dispatch.bind(listenerInstance));
            }
        }
    }
    ;
    static routes(app) {
        const routesRootPath = (0, helpers_1.base)("routes");
        (0, utils_1.generateEndpointsFromDirTree)(routesRootPath, (endpoint, path) => {
            app.use(endpoint, require(path).default);
        });
    }
    ;
}
exports.default = Setup;
