import {
  CacheDataArg
} from "types";
import drivers from "illuminate/utils/Cache/drivers";
//import CacheError from "illuminate/exceptions/utils/CacheError";

export default class Cache {
  static defaultDriver = process.env.CACHE as keyof typeof drivers ?? "memory";
  static driverName: keyof typeof drivers = this.defaultDriver;

  static driver(cacheDriver: keyof typeof drivers): typeof Cache {
    this.driverName = cacheDriver;
    return this;
  }

  static resetDriver() {
    this.driverName = this.defaultDriver;
  }

  static async get(key: string) {
    const driverHandler = drivers[this.driverName];
    this.resetDriver();
    return await driverHandler("get", key);
  }
  static async put(key: string, data: CacheDataArg, expiry?: number) {
    const driverHandler = drivers[this.driverName];
    this.resetDriver();
    return await driverHandler("put", key, data, expiry);
  }

  static async flush() {
    const driverHandler = drivers[this.driverName];
    this.resetDriver();
    return await driverHandler("flush");
  }
}