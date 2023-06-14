import { CacheDataArg } from "types";
import drivers from "illuminate/utils/Cache/drivers";
//import CacheError from "illuminate/exceptions/utils/CacheError";

const defaultDriver = process.env.CACHE as keyof typeof drivers;

export default class Cache {
  static driverName: keyof typeof drivers = defaultDriver ?? "memory";

  static driver(cacheDriver: keyof typeof drivers): typeof Cache {
    this.driverName = cacheDriver;
    return this;
  }

  static async get(key: string) {
    const driverHandler = drivers[this.driverName];
    return await driverHandler("get", key);
  }
  static async put(key: string, data: CacheDataArg, expiry?: number) {
    const driverHandler = drivers[this.driverName];
    return await driverHandler("put", key, data, expiry);
  }
}
