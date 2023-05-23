import { CacheDriverResponse } from "types";
import Cache from "illuminate/utils/Cache";
import memoryCache from "memory-cache";
import { createClient } from "redis";

const drivers: Record<string, () => CacheDriverResponse > = {
  memory: async () => memoryCache[Cache.action](...Cache.params),
  file: async () => null,

  redis: async () => {
    const redisUrl = process.env.REDIS_URL;
    const client = createClient({
      url: redisUrl
    });
    client.on("error", (err) => {
      throw err
    });
    await client.connect();
    let result: null | string = null;
    if (Cache.action === 'put') {
      const [key,
        data,
        expiry] = Cache.params;
      if (typeof data === "undefined") {
        throw new Error("data argument is required");
      }
      if (typeof expiry === "undefined") {
        throw new Error("expiry argument is required");
      }

      result = await client.setEx(key, expiry, JSON.stringify(data));
    } else {
      result = await client.get(Cache.params[0]);
    }
    await client.disconnect();
    return result;
  }
}

export default drivers;