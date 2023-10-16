import config from "config";
import IORedis from "ioredis";

export default new IORedis(config.get("cache.stores.redis"));