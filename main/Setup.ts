import { Application } from "express";
import config from "config";
import fs from "fs";
import mongoose from "mongoose";
import { container } from "tsyringe";
import { generateEndpointsFromDirTree } from "helpers";
import nodeCron from "node-cron";
import Artisan from "Artisan";
import Cache from "Cache";
import events from "~/register/events";
import crons from "~/register/cron";

export default class Setup {
  static async cachedConfig() {
    const customConfig = await Cache.driver("redis").get("config");
    customConfig && Object.assign(config, customConfig);
  }
  
  static cronJobs() {
    for (const [schedule, commands] of Object.entries(crons)) {
      if (Array.isArray(commands)) {
        for (const command of commands) {
          const [commandName, ...args] = command.split(" ")
          nodeCron.schedule(schedule, (async () => await Artisan.call(commandName as any, args, false)) as ((now: Date | "init" | "manual") => void));
        }
      } else {
        const [commandName, ...args] = commands.split(" ")
        nodeCron.schedule(schedule, (async () => await Artisan.call(commandName as any, args, false)) as ((now: Date | "init" | "manual") => void));
      }
    }
  };

  static events(app: Application) {
    for (const [event, listenerNames] of Object.entries(events)) {
      for (const listenerName of listenerNames) {
        const Listener = require(`~/app/listeners/${listenerName}`).default;
        const listenerInstance = new Listener();
        app.on(event, listenerInstance.dispatch.bind(listenerInstance));
      }
    }
  };

  static routes(app: Application) {
    const routesRootPath = "routes";
    const routesEndpointPaths = generateEndpointsFromDirTree(routesRootPath);
    for (const [endpoint, path] of Object.entries(routesEndpointPaths)) {
      app.use(endpoint, require(path).default);
    }
  };
  
  static mongooseModels() {
    const modelsBaseDir = "app/models";
    const modelsFullName = fs.readdirSync(modelsBaseDir);
    for(const modelFullName of modelsFullName){
      require("~/" + modelsBaseDir + "/" + modelFullName.split(".")[0]);
    }
  }
  
  static mongooseGlobalPlugins() {
    const globalPluginsBaseDir = "core/global/plugins";
    const globalPluginsName = fs.readdirSync(globalPluginsBaseDir);
    for(const globalPluginName of globalPluginsName){
      const plugin = require("~/" + globalPluginsBaseDir + "/" + globalPluginName.split(".")[0]).default;
      mongoose.plugin(plugin);
    }
  }
  
  static bootupServices() {
    const providersBaseDir = "app/providers";
    const providersFullName = fs.readdirSync(providersBaseDir);
    for(const providerFullName of providersFullName){
      const Provider = require("~/" + providersBaseDir + "/" + providerFullName.split(".")[0]).default;
      const provider = new Provider(container);
      provider.register();
    }
  }
}