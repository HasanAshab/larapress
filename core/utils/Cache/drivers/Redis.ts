import Driver from "~/core/utils/Cache/Driver";
import { CacheDataArg } from "Cache";
import client from "~/core/clients/redis";

export default class Redis implements Driver {
  async get(key: string) {
    return await client.get(key);
  }

  async put(key: string, data: CacheDataArg, expiry?: number) {
    data = typeof data === "string" 
      ? data 
      : JSON.stringify(data);

    if (expiry) 
      await client.set(key, data, "EX", expiry);
    else 
      await client.set(key, data);
  }
  
  async delete(key: string) {
    await client.del(key)
  }
  
  async increment(key: string, value = 1) {
    await client.incr(key, value);
  }

  async flush() {
    await client.flushall();
  }
}

export { client };
