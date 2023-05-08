"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("helpers");
const utils_1 = require("illuminate/utils");
//import Artisan from "illuminate/utils/Artisan";
//import events from "register/events";
//import crons from "register/cron";
class Setup {
    /*
    static cronJobs(): void {
      for (const [command, schedule] of Object.entries(crons)) {
        nodeCron.schedule(schedule, Artisan.getCommand(command));
      }
    };
  
    static async events(app: Application): void {
      for (const [event, listenerNames] of Object.entries(events)) {
        for (const listenerName of listenerNames) {
          const listener = await import(`app/listeners/${listenerName}`);
          app.on(event, listener.dispatch);
        }
      }
    };
    */
    static routes(app) {
        const routesRootPath = (0, helpers_1.base)("routes");
        (0, utils_1.generateEndpointsFromDirTree)(routesRootPath, async (endpoint, path) => {
            console.log(path);
            //app.use(endpoint, await import(path));
        });
    }
    ;
}
exports.default = Setup;
