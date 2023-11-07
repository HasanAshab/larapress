import Manager from "~/core/abstract/Manager";
import Config from "Config";
import CacheDriver, { CacheData } from "./CacheDriver";
import MemoryDriver from "./drivers/MemoryDriver";
import RedisDriver from "./drivers/RedisDriver";

export default class CacheManager extends Manager implements CacheDriver {
  get defaultDriver() {
    return Config.get<string>("cache.default");
  }
  
  protected createMemoryDriver() {
    return new MemoryDriver();
  }
  
  protected createRedisDriver() {
    return resolve(RedisDriver);
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
  
  increment(key: string) {
    return this.driver().increment(key);
  }
  
  decrement(key: string) {
    return this.driver().decrement(key);
  }
  
  flush() {
    return this.driver().flush();
  }
}