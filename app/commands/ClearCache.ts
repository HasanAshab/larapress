import Command from "~/core/abstract/Command";
import Config from "Config";
import Cache from "Cache";
import { execSync } from "child_process";

export default class ClearCache extends Command {
  static signature = "clear:cache {--driver=}";

  async handle() {
    const driver = "redis"//this.option("driver") ?? undefined;
    await Cache.driver(driver).flush();
    this.success("Cache cleared successfully!");
  }
}