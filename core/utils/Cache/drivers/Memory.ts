import Driver from "~/core/utils/Cache/Driver";
import memoryCache from "memory-cache";
import { CacheDataArg } from "Cache";

export default class Memory extends Driver {
  async get(key: string) {
    return memoryCache.get(key);
  }
  
  async put(key: string, data: CacheDataArg, expiry?: number) {
    data = typeof data === "string" 
      ? data
      : JSON.stringify(data);
    memoryCache.put(key, data, expiry && expiry * 1000)
  }
  
  async clear(key?: string){
    if(typeof key === "undefined") memoryCache.clear();
    else memoryCache.del(key);
  }
}