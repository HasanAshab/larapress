import { CacheDataArg } from "types";
import { customError, capitalizeFirstLetter } from "helpers";
import Driver from "illuminate/utils/Cache/Driver";
import cacheDriversConfig from "register/drivers/cache";
import Mockable from "illuminate/utils/Cache/Mockable";
import { convertToMockable } from "illuminate/decorators/class";
import fs from "fs";

@convertToMockable(Mockable)
export default class Cache {
  static driverName: typeof cacheDriversConfig.list[number] = cacheDriversConfig[process.env.NODE_ENV] ?? cacheDriversConfig.default;
  
  static driver(name: typeof cacheDriversConfig.list[number]): typeof Cache {
    this.driverName = name;
    return this;
  }
  
  static async getDriver<T extends keyof Driver>(methodName: T): Promise<Driver[T]> {
    const { default: DriverClass } = await import(`./drivers/${capitalizeFirstLetter(this.driverName)}`);
    const driver = new DriverClass();
    this.driverName = cacheDriversConfig.default;
    if(Driver.isDriver(driver)){
      return driver[methodName].bind(driver) as Driver[T];
    }
    throw customError("INVALID_CACHE_DRIVER", {driverName: this.driverName});
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