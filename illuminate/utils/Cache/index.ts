import {
  CacheDataArg
} from "types";
import { base, customError } from "helpers";
import Driver from "illuminate/utils/Cache/Driver";
import cacheDriversConfig from "register/drivers/cache";
import fs from "fs";

export default class Cache {
  static driverName: typeof cacheDriversConfig.map[keyof typeof cacheDriversConfig.map] = cacheDriversConfig.map[cacheDriversConfig.default];
  
  static driver(cacheDriver: keyof typeof cacheDriversConfig.map): typeof Cache {
    this.driverName = cacheDriversConfig.map[cacheDriver];
    return this;
  }
  
  static async getDriver<T extends keyof Driver>(methodName: T): Promise<Driver[T]> {
    const { default: DriverClass } = await import(`./drivers/${this.driverName}`);
    const driver = new DriverClass();
    this.driverName = cacheDriversConfig.map[cacheDriversConfig.default];
    if(Driver.isDriver(driver)){
      return driver[methodName].bind(driver) as Driver[T];
    }
    throw customError("INVALID_DRIVER", {driverName: this.driverName});
  }
  
  static async get(key: string) {
    const driverHandler = await this.getDriver("get");
    return await driverHandler(key);
  }
  static async put(key: string, data: CacheDataArg, expiry?: number) {
    const driverHandler = await this.getDriver("put");
    return await driverHandler(key, data, expiry);
  }

  static async clear(key?: string) {
    const driverHandler = await this.getDriver("clear");
    return await driverHandler(key);
  }
}