import { createClient } from "redis";
import { promisify } from "util";

export type CachingStrategy = "none" | "redis";

export type ConfigValue = string | number | boolean | Record<string, ConfigValue>;
export type ConfigOptions = {
  caching: CachingStrategy;
  redisUrl?: string;
};

const client = createClient();

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export default class Config {
  static data: Record<string, ConfigValue> = {};
  static options: ConfigOptions;

  static async parse({ caching = "none", redisUrl }: ConfigOptions = {}) {
    this.options = { caching };

    if (caching === "redis" && redisUrl) {
      try {
        const cachedData = await this.loadFromRedis(redisUrl);
        if (cachedData) {
          this.data = cachedData;
          return;
        }
      } catch {}
    }

    const data = require("~/config/default");
    try {
      Object.assign(data, require("~/config/" + process.env.NODE_ENV));
    } catch {}

    this.data = Object.assign(this.flattenObject(data), data);

    if (caching === "redis" && redisUrl) {
      try {
        await this.saveToRedis(redisUrl);
      } catch {}
    }
  }

  static get<T = ConfigValue>(key?: string): T {
    if (!key) return this.data;
    const value = this.data[key];
    if (!value) throw new Error(`Config not found for key "${key}"`);
    return value;
  }

  static async set(key: string, value: ConfigValue) {
    this.data[key] = value;
    
    if (this.options.caching === "redis" && this.options.redisUrl) {
      try {
        await this.saveToRedis(this.options.redisUrl);
      } catch {}
    }
  }
  
  private createClient() {
    const client = createClient({
      url: config.get<any>("redis.url")
    });
    client.on("error", err => log(err));
    return client;
  }


  private static async loadFromRedis(redisUrl: string): Promise<Record<string, ConfigValue> | null> {
    try {
      const cachedData = await getAsync("configData");
      return JSON.parse(cachedData);
    } catch {
      return null;
    }
  }

  private static async saveToRedis(redisUrl: string): Promise<void> {
    try {
      await setAsync("configData", JSON.stringify(this.data));
    } catch {}
  }

  // Rest of the methods

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
