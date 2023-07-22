import { ArtisanBaseInput } from "types"
import { Application } from "express";
import fs from "fs";
import mongoose from "mongoose";
import hidden from "mongoose-hidden";
import { base, generateEndpointsFromDirTree } from "helpers";
import nodeCron from "node-cron";
import Artisan from "illuminate/utils/Artisan";
import events from "register/events";
import crons from "register/cron";


export default class Setup {
  static cronJobs() {
    for (const [schedule, commands] of Object.entries(crons)) {
      if (Array.isArray(commands)) {
        for (const command of commands) {
          const [commandName, ...args] = command.split(" ")
          nodeCron.schedule(schedule, (async () => await Artisan.call(commandName as ArtisanBaseInput, args, false)) as ((now: Date | "init" | "manual") => void));
        }
      } else {
        const [commandName, ...args] = commands.split(" ")
        nodeCron.schedule(schedule, (async () => await Artisan.call(commandName as ArtisanBaseInput, args, false)) as ((now: Date | "init" | "manual") => void));
      }
    }
  };

  static events(app: Application) {
    for (const [event, listenerNames] of Object.entries(events)) {
      for (const listenerName of listenerNames) {
        const Listener = require(base(`app/listeners/${listenerName}`)).default;
        const listenerInstance = new Listener();
        app.on(event, listenerInstance.dispatch.bind(listenerInstance));
      }
    }
  };

  static routes(app: Application) {
    const routesRootPath = base("routes");
    const routesEndpointPaths = generateEndpointsFromDirTree(routesRootPath);
    for (const [endpoint, path] of Object.entries(routesEndpointPaths)) {
      app.use(endpoint, require(path).default);
    }
  };
  
  static mongooseModels() {
    const modelsBaseDir = base("app/models/");
    const modelsName = fs.readdirSync(modelsBaseDir);
    for(const modelName of modelsName){
      require(modelsBaseDir + modelName);
    }
  }
  
  static mongooseGlobalPlugins() {
    const globalPluginsBaseDir = base("illuminate/plugins/global/");
    const globalPluginsName = fs.readdirSync(globalPluginsBaseDir);
    for(const globalPluginName of globalPluginsName){
      const plugin = require(globalPluginsBaseDir + globalPluginName).default;
      mongoose.plugin(plugin);
    }
    mongoose.plugin(hidden(), { hidden: { _id: false } });
  }
}