import { Application } from "express";
import fs from "fs";
import mongoose from "mongoose";
import { container } from "tsyringe";
import { middleware, generateEndpoints } from "~/core/utils";
import { globalMiddlewares } from "~/app/http/kernel"
import nodeCron from "node-cron";
import Artisan from "Artisan";
import crons from "~/register/cron";

export default class Setup {
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

  static bootstrap(app: Application) {
    const providersBaseDir = "app/providers";
    const providersFullName = fs.readdirSync(providersBaseDir);
    for(const providerFullName of providersFullName){
      const Provider = require("~/" + providersBaseDir + "/" + providerFullName.split(".")[0]).default;
      const provider = new Provider(app);
      provider.register?.();
      provider.boot?.();
    }
  }
}