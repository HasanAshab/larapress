import _ from "lodash";
import config from "config";
import { Config } from "types";
import CacheStore from "./CacheStore";

export type CacheDataArg = string | number | boolean | object | unknown[] | Buffer;

export default class Cache {
  static $storeName = config.get("cache.default");
  static $stores = {};
  
  static repository(instance: CacheStore) {
    this.$stores[instance.store] = instance;
  }
  
  static store(name: string) {
    this.$storeName = name;
    return this;
  }

  private static currentStore(): CacheStore {
    const driver = this.$stores[this.$storeName];
    this.$storeName = config.get("cache.default");
    return driver;
  }

  static get(key: string) {
    return this.currentStore().get(key);
  }

  static put(key: string, data: CacheDataArg, expiry?: number) {
    return this.currentStore().put(key, data, expiry);
  }

  static delete(key: string) {
    return this.currentStore().delete(key);
  }
  
  static increment(key: string, value = 1) {
    return this.currentStore().increment(key, value);
  }
  
  static flush() {
    return this.currentStore().flush();
  }
}