import Driver from "~/core/utils/Cache/Driver";
import config from "config";
import IORedis from "ioredis";
import { CacheDataArg } from "types";

const client = new IORedis(config.get("redis"));

export default class Redis extends Driver {
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

  async clear(key?: string) {
    if(typeof key === "undefined") await client.flushAll();
    else await client.del(key)
  }
}

export { client };
