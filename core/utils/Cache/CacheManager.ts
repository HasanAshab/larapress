import Manager from "~/core/abstract/Manager";
import Config from "Config";
import CacheDriver from "./CacheDriver";
import MemoryDriver from "./drivers/MemoryDriver";
import RedisDriver from "./drivers/RedisDriver";

export default class CacheManager extends Manager implements CacheDriver {
  protected getDefaultDriver() {
    return Config.get("cache.default");
  }
  
  protected createMemoryDriver() {
    return new MemoryDriver();
  }
  
  protected createRedisDriver() {
    return new RedisDriver();
  }
  
  get(key: string) {
    return this.driver().get(key);
  }

  put(key: string, data: CacheData, expiry?: number) {
    return this.driver().put(key, data, expiry);
  }

  delete(key: string) {
    return this.driver().delete(key);
  }
  
  increment(key: string, value = 1) {
    return this.driver().increment(key, value);
  }
  
  flush() {
    return this.driver().flush();
  }
}