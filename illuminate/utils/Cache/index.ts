import { CacheDataArg } from "types";
import config from "config";
import { customError, capitalizeFirstLetter } from "helpers";
import Driver from "~/illuminate/utils/Cache/Driver";
import cacheConfig from "~/register/cache";
import Mockable from "~/illuminate/utils/Cache/Mockable";
import { util } from "~/illuminate/decorators/class";
import fs from "fs";

@util(Mockable)
export default class Cache {
  static driverName: typeof cacheConfig.drivers[number] = config.get<any>("cache") as any;
  
  static driver(name: typeof cacheConfig.drivers[number]) {
    this.driverName = name;
    return this;
  }
  
  static async getDriver<T extends keyof Driver>(methodName: T): Promise<Driver[T]> {
    const { default: DriverClass } = await import(`./drivers/${capitalizeFirstLetter(this.driverName)}`);
    const driver = new DriverClass();
    this.driverName = config.get<any>("cache");
    return (driver[methodName] as any).bind(driver) as Driver[T];
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