import Driver from "~/core/utils/Cache/Driver";
import config from "config";
import { createClient } from "redis";
import { CacheDataArg } from "types";
import { log } from "helpers";

const client = createClient({
  url: config.get<string>("redis.url")
});
client.on("error", err => log(err));
//client.connect();


export default class Redis extends Driver {
  async get(key: string) {
    return await client.get(key);
  }

  async put(key: string, data: CacheDataArg, expiry?: number) {
    data = typeof data === "string" 
      ? data 
      : JSON.stringify(data);

    if (expiry) 
      await client.setEx(key, expiry, data);
    else 
      await client.set(key, data);
  }

  async clear(key?: string) {
    if(typeof key === "undefined") await client.flushAll();
    else await client.del(key)
  }
}

export { client };
