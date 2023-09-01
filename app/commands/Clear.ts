import Command from "~/core/commands/Command";
import { storage, log } from "helpers";
import fs from "fs";
import path from "path";
import Cache from "Cache";
import cacheConfig from "~/register/cache";
import { execSync } from "child_process";

export default class Clear extends Command {
  uploads() {
    execSync("rm -r storage/public/uploads");
    execSync("mkdir  storage/public/uploads");
    this.success("Uploads are cleared now!");
  }
  
  reports() {
    this.requiredParams(["name"]);
    const { name } = this.params;
    execSync("rm -r storage/reports/" + name);
    execSync("mkdir  storage/reports/" + name);
    this.success(name + " reports are clear now!");
  }
  
  async cache() {
    const { key, driver } = this.params;
    if(driver){
      await Cache.driver(driver).clear(key);
    }
    else {
      const tasks: any = [];
      for(const driverName of cacheConfig.drivers) {
        const task = Cache.driver(driverName).clear(key);
        tasks.push(task);
      }
      await Promise.all(tasks);
    }
    this.success("Cache cleared successfully!");
  }
  
}