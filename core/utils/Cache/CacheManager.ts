import Manager from "~/core/abstract/Manager";
import Config from "Config";
import MemoryStore from "./stores/MemoryStore";
import RedisStore from "./stores/RedisStore";

export type CacheDataArg = string | number | boolean | object | unknown[] | Buffer;

export default class CacheManager extends Manager {
  protected getDefaultDriver() {
    return Config.get("cache.default");
  }
  
  protected createMemoryDriver() {
    return new MemoryStore();
  }
  
  protected createRedisDriver() {
    return new RedisStore();
  }
  
  store(name: string) {
    return this.driver(name);
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