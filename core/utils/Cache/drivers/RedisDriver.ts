import CacheDriver, { CacheData } from "../CacheDriver";
import { injectable } from "tsyringe";
import IORedis from "ioredis";

@injectable()
export default class RedisDriver extends CacheDriver {
  constructor(private readonly client: IORedis) {}

  async get(key: string) {
    return await this.client.get(key);
  }

  async put(key: string, data: CacheData, expiry?: number) {
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
  
  async increment(key: string) {
    return await this.client.incr(key);
  }
  
  async decrement(key: string) {
    return await this.client.decr(key);
  }

  async flush() {
    await this.client.flushall();
  }
}