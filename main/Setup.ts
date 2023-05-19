import { base } from "helpers";
import { Application } from 'express';
import { generateEndpointsFromDirTree } from "illuminate/utils";
import nodeCron from "node-cron";
import Artisan from "illuminate/utils/Artisan";
import events from "register/events";
import crons from "register/cron";

export default class Setup {
  static cronJobs(): void {
    for (const [command, schedule] of Object.entries(crons)) {
      nodeCron.schedule(schedule, Artisan.getCommand(command.split(' '), false));
    }
  };

  static events(app: Application): void {
    for (const [event, listenerNames] of Object.entries(events)) {
      for (const listenerName of listenerNames) {
        const Listener = require(base(`app/listeners/${listenerName}`)).default;
        const listenerInstance = new Listener();
        app.on(event, listenerInstance.dispatch.bind(listenerInstance));
      }
    }
  };

  static routes(app: Application): void {
    const routesRootPath = base("routes");
    generateEndpointsFromDirTree(routesRootPath, (endpoint: string, path: string) => {
      app.use(endpoint, require(path).default);
    });
  };
}