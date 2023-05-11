"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memory_cache_1 = __importDefault(require("memory-cache"));
const redis_1 = require("redis");
const CacheError_1 = __importDefault(require("illuminate/exceptions/utils/CacheError"));
const redisUrl = process.env.REDIS_URL;
class Cache {
    static driver(cacheDriver) {
        this._driver = cacheDriver;
        return this;
    }
    static memoryDriver() {
        return memory_cache_1.default[this.action](...this.params);
    }
    static async redisDriver() {
        const client = (0, redis_1.createClient)({
            url: redisUrl
        });
        client.on("error", (err) => { throw err; });
        await client.connect();
        const result = await client[this.action.replace('put', 'set')](...this.params);
        await client.disconnect();
        return result;
    }
    static fileDriver() {
        throw new Error('This should be implemented');
    }
    static async get(key) {
        this.params = [key];
        this.action = "get";
        try {
            return await this[`${this._driver}Driver`]();
        }
        catch (_a) {
            throw CacheError_1.default.type("INVALID_DRIVER").create();
        }
    }
    static async put(...params) {
        this.params = params;
        this.action = "put";
        try {
            return await this[`${this._driver}Driver`]();
        }
        catch (_a) {
            throw CacheError_1.default.type("INVALID_DRIVER").create();
        }
    }
}
Cache._driver = process.env.CACHE;
exports.default = Cache;
module.exports = Cache;
