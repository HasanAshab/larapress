import drivers from "illuminate/utils/Cache/drivers";
import { CacheDriverResponse } from "types";
import CacheError from "illuminate/exceptions/utils/CacheError";

export default class Cache {
  static _driver = process.env.CACHE || "memory";
  static action: "get" | "put";
  static params: [string, (string | object | any[])?, number?];

  static driver(cacheDriver: string): Cache {
    this._driver = cacheDriver;
    return this;
  }

  static async get(key: string): CacheDriverResponse {
    this.params = [key];
    this.action = "get";
    const driverMethod = drivers[this._driver];
    if(driverMethod) {
      return await driverMethod();
    } else {
      throw CacheError.type("INVALID_DRIVER").create();
    }
  }

  static async put(...params: [string, any, number?]): CacheDriverResponse {
    this.params = params;
    this.action = "put";
    const driverMethod = drivers[this._driver];
    if(driverMethod) {
      return await driverMethod();
    } else {
      throw CacheError.type("INVALID_DRIVER").create();
    }
  }
}
