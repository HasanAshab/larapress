import _ from "lodash";
import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from "config";
import Cache from "Cache";

export default class AppServiceProvider extends ServiceProvider {
  boot() {
    if(env("NODE_ENV") === "production")
      this.app.once("booted", this.useCachedConfig);
  }

  private async useCachedConfig() {
    const cachedConfig = await Cache.get("config");
    cachedConfig && _.merge(config, cachedConfig)
  }
}