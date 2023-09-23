import config from "config";
import { Config } from "types";
import { capitalizeFirstLetter } from "helpers";
import Driver from "~/core/utils/Cache/Driver";
import { util } from "~/core/decorators/class";
import fs from "fs";

export type CacheDataArg = string | number | boolean | object | unknown[] | Buffer;
type DriverName = Config["cache"]["drivers"][number];

const driverInstances = {} as {
  [Name in DriverName]: Driver
};

function initializeDrivers() {
  for (const driverName of config.get<DriverName[]>("cache.drivers")) {
    const DriverClass = require(`./drivers/${capitalizeFirstLetter(driverName)}`).default as any;
    driverInstances[driverName] = new DriverClass();
  }
}

@util("~/core/utils/Cache/Mockable")
export default class Cache {
  static driverName = config.get<DriverName>("cache.default");

  static driver(name: DriverName) {
    this.driverName = name;
    return this;
  }

  private static getDriver(): Driver {
    const driver = driverInstances[this.driverName];
    this.driverName = config.get<DriverName>("cache.default");
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

  static clear(key?: string) {
    const driver = this.getDriver();
    return driver.clear(key);
  }
}

initializeDrivers();
