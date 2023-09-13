import { CacheDataArg } from "types";
import config from "config";
import { capitalizeFirstLetter } from "helpers";
import Driver from "~/core/utils/Cache/Driver";
import { drivers } from "~/register/cache";
import Mockable from "~/core/utils/Cache/Mockable";
import { util } from "~/core/decorators/class";
import fs from "fs";

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

  static async get(key: string) {
    const driver = this.getDriver();
    return await driver.get(key);
  }

  static async put(key: string, data: CacheDataArg, expiry?: number) {
    const driver = this.getDriver();
    return await driver.put(key, data, expiry);
  }

  static async clear(key?: string) {
    const driver = this.getDriver();
    return await driver.clear(key);
  }
}

// Initialize drivers when the module is imported
initializeDrivers();
