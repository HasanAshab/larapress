import Manager from "~/core/abstract/Manager";
import Config from "Config";
import Memory from "./stores/Memory";
import Redis from "./stores/Redis";

export type CacheDataArg = string | number | boolean | object | unknown[] | Buffer;

export default class CacheManager extends Manager {
  protected getDefaultDriver() {
    return Config.get("cache.default");
  }
  
  protected createMemoryDriver() {
    return new Memory();
  }
  
  protected createRedisDriver() {
    return new Redis();
  }

  get(key: string) {
    this.driver().get(key);
  }

  put(key: string, data: CacheDataArg, expiry?: number) {
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