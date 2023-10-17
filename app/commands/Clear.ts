import Command from "~/core/abstract/Command";
import config from "config";
import fs from "fs";
import path from "path";
import Cache from "Cache";
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
    const { driver } = this.params;
    if(driver){
      await Cache.driver(driver).flush();
    }
    else {
      const tasks: any = [];
      for(const driverName of Object.keys(config.get("cache.stores"))) {
        const task = Cache.driver(driverName).flush();
        tasks.push(task);
      }
      await Promise.all(tasks);
    }
    this.success("Cache cleared successfully!");
  }
  
}