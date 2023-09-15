import config from "config";
import { capitalizeFirstLetter } from "helpers";
import Driver from "~/core/utils/Cache/Driver";
import { drivers } from "~/register/cache";
import Mockable from "~/core/utils/Cache/Mockable";
import { util } from "~/core/decorators/class";
import fs from "fs";

export type CacheDataArg = string | number | boolean | object | unknown[] | Buffer;

const driverInstances: Record<typeof drivers[number], Driver> = {};

function initializeDrivers() {
  for (const driverName of drivers) {
    const DriverClass = require(`./drivers/${capitalizeFirstLetter(driverName)}`).default as any;
    driverInstances[driverName] = new DriverClass();
  }
}

@util(Mockable)
export default class Cache {
  static driverName: typeof drivers[number] = config.get<any>("cache") as any;

  static driver(name: typeof drivers[number]) {
    this.driverName = name;
    return this;
  }

  private static getDriver(): Driver {
    return driverInstances[this.driverName];
  }

  static get(key: string) {
    const driver = this.getDriver();
    return driver.get(key);
  }

  static put(key: string, data: CacheDataArg, expiry?: number) {
    const driver = this.getDriver();
    return driver.put(key, data, expiry);
  }

  static clear(key?: string) {
    const driver = this.getDriver();
    return driver.clear(key);
  }
}

initializeDrivers();
