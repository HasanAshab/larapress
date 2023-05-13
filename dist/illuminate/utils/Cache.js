"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const memory_cache_1 = __importDefault(require("memory-cache"));
const redis_1 = require("redis");
const CacheError_1 = __importDefault(require("illuminate/exceptions/utils/CacheError"));
class Cache {
    static driver(cacheDriver) {
        this._driver = cacheDriver;
        return this;
    }
    static async get(key) {
        this.params = [key];
        this.action = "get";
        const driverMethod = Cache.driverMethods[this._driver];
        if (driverMethod) {
            return await driverMethod();
        }
        else {
            throw CacheError_1.default.type("INVALID_DRIVER").create();
        }
    }
    static async put(...params) {
        this.params = params;
        this.action = "put";
        const driverMethod = Cache.driverMethods[this._driver];
        if (driverMethod) {
            return await driverMethod();
        }
        else {
            throw CacheError_1.default.type("INVALID_DRIVER").create();
        }
    }
}
_a = Cache;
Cache._driver = process.env.CACHE || 'memory';
Cache.driverMethods = {
    memory: () => memory_cache_1.default[Cache.action](...Cache.params),
    redis: async () => {
        const redisUrl = process.env.REDIS_URL;
        const client = (0, redis_1.createClient)({
            url: redisUrl
        });
        client.on("error", (err) => { throw err; });
        await client.connect();
        let result = null;
        if (Cache.action === 'put') {
            const [key, data, expiry] = Cache.params;
            if (typeof data === "undefined") {
                throw new Error("data argument is required");
            }
            if (typeof expiry === "undefined") {
                throw new Error("expiry argument is required");
            }
            result = await client.setEx(key, expiry, JSON.stringify(data));
        }
        else {
            result = await client.get(Cache.params[0]);
        }
        await client.disconnect();
        return result;
    },
    file: () => {
        throw new Error('This should be implemented');
    }
};
exports.default = Cache;
