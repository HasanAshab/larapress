import Driver from "illuminate/utils/Cache/Driver";
import config from "config";
import { createClient } from "redis";
import { CacheDataArg } from "types";
import { log } from "helpers";

export default class Redis extends Driver {
  
  private createClient() {
    const client = createClient({
      url: config.get("redis.url")
    });
    client.on("error", err => log(err));
    return client;
  }

  async get(key: string): Promise < string | null > {
    const client = this.createClient();
    await client.connect();
    const result = await client.get(key);
    await client.disconnect();
    return result !== null ? JSON.parse(result): null;
  }

  async put(key: string, data: CacheDataArg, expiry?: number) {
    const client = this.createClient();
    await client.connect();
    if (typeof expiry === "number") await client.setEx(key, expiry, JSON.stringify(data));
    else await client.set(key, JSON.stringify(data));
    await client.disconnect();
  }

  async clear(key?: string) {
    const client = this.createClient();
    await client.connect();
    if(typeof key === "undefined") await client.flushAll();
    else await client.del(key)
    await client.disconnect();
  }
}