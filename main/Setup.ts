import { base } from "helpers";
import { Application } from 'express';
import { generateEndpointsFromDirTree } from "illuminate/utils";
import nodeCron from "node-cron";
//import Artisan from "illuminate/utils/Artisan";
//import events from "register/events";
//import crons from "register/cron";


export default class Setup {
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
  static routes(app: Application): void {
    const routesRootPath = base("routes");
    generateEndpointsFromDirTree(routesRootPath, async (endpoint: string, path: string): Promise<void> => {
      console.log(path)
      //app.use(endpoint, await import(path));
    });
  };
}