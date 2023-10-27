import CacheStore from "~/core/utils/Cache/CacheStore";
import { CacheDataArg } from "Cache";
import { autoInjectable } from "tsyringe";
import IORedis from "ioredis";

@autoInjectable()
export default class RedisStore implements CacheStore {
  constructor(private readonly client: IORedis) {}

  async get(key: string) {
    return await this.client.get(key);
  }

  async put(key: string, data: CacheDataArg, expiry?: number) {
    data = typeof data === "string" 
      ? data 
      : JSON.stringify(data);

    if (expiry) 
      await this.client.set(key, data, "EX", expiry);
    else 
      await this.client.set(key, data);
  }
  
  async delete(key: string) {
    await this.client.del(key)
  }
  
  async increment(key: string, value = 1) {
    await this.client.incr(key, value);
  }
  
  async decrement(key: string, value = 1) {
    await this.client.decr(key, value);
  }

  async flush() {
    await this.client.flushall();
  }
}