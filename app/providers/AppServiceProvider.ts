import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from "config";
import Cache from "Cache";

export default class AppServiceProvider extends ServiceProvider {
  boot() {
    if(process.env.NODE_ENV === "production")
      this.useCachedConfig();
  }
  
  private async useCachedConfig() {
    const customConfig = await Cache.driver("redis").get("config");
    customConfig && Object.assign(config, customConfig);
  }
}