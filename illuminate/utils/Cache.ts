import memoryCache from "memory-cache";
import { createClient } from "redis";
import CacheError from "illuminate/exceptions/utils/CacheError";

type DriverMethods = {
  [key: string]: (...params: any[]) => any
}

export default class Cache {
  static _driver = process.env.CACHE || 'memory';
  static action: "get" | "put";
  static params: [string, (string | object | any[])?, number?];
  static driverMethods: DriverMethods = {
    memory: () => memoryCache[Cache.action](...Cache.params),
    redis: async (): Promise<null | string> => {
      const redisUrl = process.env.REDIS_URL;
      const client = createClient({
        url: redisUrl
      });
      client.on("error", (err) => {throw err});
      await client.connect();
      let result: null | string = null;
      if(Cache.action === 'put'){
        const [key, data, expiry] = Cache.params;
        if(typeof data === "undefined"){
          throw new Error("data argument is required");
        }
        if(typeof expiry === "undefined"){
          throw new Error("expiry argument is required");
        }
        
        result = await client.setEx(key, expiry, JSON.stringify(data));
      }
      else {
        result = await client.get(Cache.params[0]);
      }
      await client.disconnect();
      return result;
    },
    file: () => {
      throw new Error('This should be implemented');
    }
  }

  static driver(cacheDriver: string): Cache {
    this._driver = cacheDriver;
    return this;
  }

  static async get(key: string): Promise<any> {
    this.params = [key];
    this.action = "get";
    const driverMethod = Cache.driverMethods[this._driver];
    if(driverMethod) {
      return await driverMethod();
    } else {
      throw CacheError.type("INVALID_DRIVER").create();
    }
  }

  static async put(...params: [string, any, number?]): Promise<void> {
    this.params = params;
    this.action = "put";
    const driverMethod = Cache.driverMethods[this._driver];
    if(driverMethod) {
      return await driverMethod();
    } else {
      throw CacheError.type("INVALID_DRIVER").create();
    }
  }
}
