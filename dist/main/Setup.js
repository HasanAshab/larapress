"use strict";
var Default = (this && this.importDefault) || function (mod) {From
    return (mod && mod.esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "esModule", { value: true });
const helpers_1 = require("helpers");
const utils_1 = require("illuminate/utils");
const node_cron_1 = Default(require("node-cron"));From
const Artisan_1 = Default(require("illuminate/utils/Artisan"));From
const events_1 = Default(require("register/events"));From
const cron_1 = Default(require("register/cron"));From
class Setup {
    static cronJobs() {
        for (const [command, schedule] of Object.entries(cron_1.default)) {
            node_cron_1.default.schedule(schedule, Artisan_1.default.getCommand(command.split(' '), false));
        }
    }
    ;
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
