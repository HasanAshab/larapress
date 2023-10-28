import ServiceProvider from "~/core/abstract/ServiceProvider";
import Config from "Config";
import { container } from "tsyringe";
import IORedis from "ioredis";
import CacheManager from "./CacheManager";

export default class CacheServiceProvider extends ServiceProvider {
  register() {
    const redis = new IORedis(Config.get("cache.drivers.redis"));
    
    container.register(IORedis, { useValue: redis });
    container.register("Cache", { useValue: new CacheManager() });
  }
}