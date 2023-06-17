import {
  CacheDataArg
} from "types";
import { base } from "helpers";
import Driver from "illuminate/utils/Cache/Driver";
import cacheDriversConfig from "register/drivers/cache";
import fs from "fs";
//import CacheError from "illuminate/exceptions/utils/CacheError";

type CacheDriverName = Exclude<typeof cacheDriversConfig[keyof typeof cacheDriversConfig], typeof cacheDriversConfig.default>
type CacheDriverKey = Exclude<keyof typeof cacheDriversConfig, "default">


export default class Cache {
  static driverName: CacheDriverName = cacheDriversConfig[cacheDriversConfig.default];
  
  static driver(cacheDriver: CacheDriverKey): typeof Cache {
    this.driverName = cacheDriversConfig[cacheDriver];
    return this;
  }
  
  static async getDriver<T extends keyof Driver>(methodName: T): Promise<Driver[T]> {
    const { default: DriverClass } = await import(`illuminate/utils/cache/drivers/${this.driverName}`);
    const driver = new DriverClass();
    this.driverName = cacheDriversConfig[cacheDriversConfig.default];
    if(Driver.isDriver(driver)){
      return driver[methodName];
    }
    throw new Error(`Cache driver not implemented for ${this.driverName} driver.`);
  }
  
  static async get(key: string) {
    const driverHandler = await this.getDriver("get");
    console.log(driverHandler)
    return await driverHandler(key);
  }
  static async put(key: string, data: CacheDataArg, expiry?: number) {
    const driverHandler = await this.getDriver("put");
    return await driverHandler(key, data, expiry);
  }

  static async clear() {
    const driverHandler = await this.getDriver("clear");
    return await driverHandler();
  }
}