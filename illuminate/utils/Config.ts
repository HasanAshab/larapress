import { createClient } from "redis";
import { promisify } from "util";

export type CachingStrategy = "none" | "redis";

export type ConfigValue = string | number | boolean | Record<string, ConfigValue>;
export type ConfigOptions = {
  caching: CachingStrategy;
  redisUrl?: string;
};


export default class Config {
  static data: Record<string, ConfigValue> = {};
  static options: ConfigOptions;

  static async parse({ caching = "none", redisUrl }: ConfigOptions = {}) {
    this.options = { caching, redisUrl };
    if (caching === "redis" && redisUrl) {
      this.client = createClient({ url: redisUrl });
      const cachedData = await this.loadFromRedis();
      if (cachedData) {
        this.data = cachedData;
        return;
      }
    }
    const data = require("~/config/default");
    try {
      Object.assign(data, require("~/config/" + process.env.NODE_ENV));
    } catch {}

    this.data = Object.assign(this.flattenObject(data), data);

    if (caching === "redis" && redisUrl) {
      await this.saveToRedis();
    }
  }

  static get<T = ConfigValue>(key?: string): T {
    if (!key) return this.data;
    const value = this.data[key];
    if (!value) throw new Error(`Config not found for key "${key}"`);
    return value;
  }

  static async set(data: object) {
    Object.assign(this.data, data, this.flattenObject(data));
    console.log(this.options)
    if (this.options.caching === "redis" && this.options.redisUrl) {
      await this.saveToRedis(this.options.redisUrl);
    }
  }


  private static async loadFromRedis() {
    await this.client.connect();
    const cachedData = await this.client.get("configData");
    await this.client.disconnect();
    return JSON.parse(cachedData);
  }

  private static async saveToRedis() {
    await this.client.connect();
    await this.client.set("configData", JSON.stringify(this.data));
    await this.client.disconnect();
  }

  private static flattenObject<T extends Record<string, any>>(obj: T, prefix = ''): Record<string, any> {
    const flatObject: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          const nestedFlatObject = this.flattenObject(value, prefix + key + '.');
          Object.assign(flatObject, nestedFlatObject);
        } else {
          flatObject[prefix + key] = value;
        }
      }
    }
    return flatObject;
  }
}
