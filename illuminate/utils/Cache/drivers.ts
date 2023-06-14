import { CacheDriverHandler, CacheArgs, CacheDataArg } from "types";
import { log } from "helpers";
import memoryCache from "memory-cache";
import { createClient } from "redis";

const memory: CacheDriverHandler = (action, key, data?, expiry?): any => memoryCache[action](key, data);

const redis: CacheDriverHandler = async (action, key, data?, expiry?): Promise<any> => {
  const redisUrl = process.env.REDIS_URL;
  const client = createClient({
    url: redisUrl
  });
  client.on("error", err => log(err));
  await client.connect();
  if (action === "get") {
    const result = await client.get(key);
    await client.disconnect();
    return result !== null ? JSON.parse(result) : result;
  }
  if(typeof expiry === "number") await client.setEx(key, expiry, JSON.stringify(data!));
  else await client.set(key, JSON.stringify(data!));
  await client.disconnect();
}

export default {
  memory,
  redis
};