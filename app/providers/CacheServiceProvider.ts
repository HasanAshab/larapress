import ServiceProvider from "~/core/abstract/ServiceProvider";
import config from "config";
import Cache from "Cache";
import { container } from "tsyringe";
import IORedis from "ioredis";
import Memory from "~/core/utils/Cache/stores/Memory";
import Redis from "~/core/utils/Cache/stores/Redis";

export default class CacheServiceProvider extends ServiceProvider {
  register() {
    const redis = new IORedis(config.get("cache.stores.redis"));
    container.register(IORedis, { useValue: redis });
  }
  
  boot() {
    Cache.repository(new Memory());
    Cache.repository(new Redis());
  }
}