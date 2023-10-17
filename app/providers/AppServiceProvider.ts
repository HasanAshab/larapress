import _ from "lodash";
import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from "config";
import Cache from "Cache";

export default class AppServiceProvider extends ServiceProvider {
  boot() {
    if(this.app.runningInWeb())
      this.app.on("booted", this.useCachedConfig);
  }

  private async useCachedConfig() {
    const cachedConfig = await Cache.get("config");
    cachedConfig && _.merge(config, cachedConfig)
  }
}