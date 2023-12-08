import ServiceProvider from "~/core/providers/ServiceProvider";
import Config from "Config";
import { container } from "tsyringe";
import IORedis from "ioredis";

export default class CacheServiceProvider extends ServiceProvider {
  register() {
    const redis = new IORedis(Config.get("cache.drivers.redis"));
    container.register(IORedis, { useValue: redis });
  }
}