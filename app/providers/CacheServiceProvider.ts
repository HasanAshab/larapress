import ServiceProvider from "~/core/abstract/ServiceProvider";
import Config from "Config";
import Cache from "Cache";
import { container } from "tsyringe";
import IORedis from "ioredis";
import Memory from "~/core/utils/Cache/stores/Memory";
import Redis from "~/core/utils/Cache/stores/Redis";

export default class CacheServiceProvider extends ServiceProvider {
  register() {
    const redis = new IORedis(Config.get("cache.stores.redis"));
    container.register(IORedis, { useValue: redis });
  }
  
  boot() {
    Cache.repository(new Memory());
    Cache.repository(new Redis());
  }
}