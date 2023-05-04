const memoryCache = require("memory-cache");
const { createClient } = require("redis");
const CacheError = require(base("illuminate/exceptions/utils/CacheError"));
const redisUrl = process.env.REDIS_URL;
const defaultDriver = process.env.CACHE;

class Cache {
  static driver(cacheDriver = defaultDriver) {
    this._driver = cacheDriver;
    return this;
  }

  static memoryDriver() {
    return memoryCache[this.action](...this.params);
  }

  static async redisDriver() {
    const client = createClient({
      url: redisUrl
    });
    client.on("error", (err) => {throw err});
    await client.connect();
    const result = await client[this.action.replace('put', 'set')](...this.params);
    await client.disconnect();
    return result;
  }

  static fileDriver() {
    throw new Error('This should be implemented');
  }

  static async get(...params) {
    this.params = params;
    this.action = "get";
    if (typeof this._driver === "undefined") {
      this.driver();
    }
    try {
      return await this[`${this._driver}Driver`]();
    } catch {
      throw CacheError.type("INVALID_DRIVER").create();
    }
  }

  static put(...params) {
    this.params = params;
    this.action = "put";
    if (typeof this._driver === "undefined") {
      this.driver();
    }
    try {
      return this[`${this._driver}Driver`]();
    } catch {
      throw CacheError.type("INVALID_DRIVER").create();
    }
  }
}

module.exports = Cache;
