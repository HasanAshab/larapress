import _ from "lodash";
import config from "config";
import { Config } from "types";
import Driver from "./Driver";
import Memory from "./drivers/Memory";
import Redis from "./drivers/Redis";
import { util } from "~/core/decorators/class";

export type CacheDataArg = string | number | boolean | object | unknown[] | Buffer;
type DriverName = keyof typeof Cache.driverInstances;


@util("~/core/utils/Cache/Mockable")
export default class Cache {
  static driverName = config.get<DriverName>("cache.default");
  static driverInstances = {
    memory: new Memory(),
    redis: new Redis()
  }

  static driver(name: DriverName) {
    this.driverName = name;
    return this;
  }

  private static getDriver(): Driver {
    const driver = this.driverInstances[this.driverName];
    this.driverName = config.get<DriverName>("cache");
    return driver;
  }

  static get(key: string) {
    const driver = this.getDriver();
    return driver.get(key);
  }

  static put(key: string, data: CacheDataArg, expiry?: number) {
    const driver = this.getDriver();
    return driver.put(key, data, expiry);
  }

  static delete(key: string) {
    return this.getDriver().delete(key);
  }
  
  static increment(key: string, value = 1) {
    return this.getDriver().increment(key, value);
  }
  
  static flush() {
    return this.getDriver().flush();
  }
}