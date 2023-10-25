import Command from "~/core/abstract/Command";
import Config from "Config";
import Cache from "Cache";
import { execSync } from "child_process";

export default class ClearCache extends Command {
  static signature = "clear:cache {--driver=}";

  async handle() {
    const driver = this.option("driver");
    if(driver){
      await Cache.driver(driver).flush();
    }
    else {
      const tasks: Promise<any>[] = [];
      for(const driverName of Object.keys(Config.get("cache.stores"))) {
        const task = Cache.driver(driverName).flush();
        tasks.push(task);
      }
      await Promise.all(tasks);
    }
    this.success("Cache cleared successfully!");
  }
}