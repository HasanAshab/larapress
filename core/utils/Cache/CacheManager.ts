import Manager from "~/core/abstract/Manager";
import type CacheDriver, { CacheData, Resolver } from "./CacheDriver";
import MemoryDriver from "./drivers/MemoryDriver";
import RedisDriver from "./drivers/RedisDriver";
import Config from "Config";

export default class CacheManager extends Manager implements CacheDriver {
  defaultDriver() {
    return Config.get<string>("cache.default");
  }
  
  protected createMemoryDriver() {
    return new MemoryDriver();
  }
  
  protected createRedisDriver() {
    return resolve(RedisDriver);
  }
  
  get(key: string, deserialize?: boolean) {
    return this.driver().get(key, deserialize);
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
  
  remember(key: string, expiry: number, resolver: Resolver) {
    return this.driver().remember(key, expiry, resolver);
  }
  
  rememberSerialized(key: string, expiry: number, resolver: Resolver) {
    return this.driver().rememberSerialized(key, expiry, resolver);
  }
  
  rememberForever(key: string, resolver: Resolver) {
    return this.driver().rememberForever(key, resolver);
  }
  
  rememberSerializedForever(key: string, resolver: Resolver) {
    return this.driver().rememberSerializedForever(key, resolver);
  }
  
}