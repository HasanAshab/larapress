import memoryCache from "memory-cache";
import { createClient } from "redis";
import CacheError from "illuminate/exceptions/utils/CacheError";
const redisUrl = process.env.REDIS_URL;

export default class Cache {
  static _driver = process.env.CACHE;
  static action: "get" | "put";
  static params: [string, any?, number?];
  
  static driver(cacheDriver: string): Cache {
    this._driver = cacheDriver;
    return this;
  }

  static memoryDriver(): any {
    return memoryCache[this.action](...this.params);
  }

  static async redisDriver(): Promise<any> {
    const client = createClient({
      url: redisUrl
    });
    client.on("error", (err) => {throw err});
    await client.connect();
    const result = await client[this.action.replace('put', 'set')](...this.params);
    await client.disconnect();
    return result;
  }

  static fileDriver(): never {
    throw new Error('This should be implemented');
  }

  static async get(key: string): Promise<any> {
    this.params = [key];
    this.action = "get";
    try {
      return await this[`${this._driver}Driver`]();
    } catch {
      throw CacheError.type("INVALID_DRIVER").create();
    }
  }

  static async put(...params: [string, any, number?]): void {
    this.params = params;
    this.action = "put";
    try {
      return await this[`${this._driver}Driver`]();
    } catch {
      throw CacheError.type("INVALID_DRIVER").create();
    }
  }
}

module.exports = Cache;
