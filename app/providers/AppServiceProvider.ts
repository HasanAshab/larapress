import _ from "lodash";
import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from "config";
import Cache from "Cache";

export default class AppServiceProvider extends ServiceProvider {
  boot() {
    if(this.app.runningInWeb())
      this.useCachedConfig();
  }

  private async useCachedConfig() {
    const cachedConfig = await Cache.driver("redis").get("config");
    cachedConfig && _.merge(config, cachedConfig)
  }
}