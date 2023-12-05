import CacheDriver, { CacheData } from "../CacheDriver";
import { injectable } from "tsyringe";
import IORedis from "ioredis";

@injectable()
export default class RedisDriver extends CacheDriver {
  constructor(private readonly client: IORedis) {
    super()
  }

  async get(key: string, deserialize = true) {
    let data = await this.client.get(key);
    
    if(deserialize) {
      data = this.deserialize(data);
    }
    
    return data;
  }

  async put<T extends CacheData>(key: string, data: T, expiry?: number) {
    if (expiry) {
      await this.client.set(key, this.serialize(data), "EX", expiry);
    }
    else {
      await this.client.set(key, this.serialize(data));
    }
    
    return data;
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