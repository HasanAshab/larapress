import Driver from "illuminate/utils/Cache/Driver";
import memoryCache from "memory-cache";
import { CacheDataArg } from "types";

export default class Memory extends Driver {
  get(key: string): string | null {
    const data = memoryCache.get(key);
    return data !== null ? JSON.parse(data) : null;
  }
  
  put(key: string, data: CacheDataArg, expiry?: number) {
    memoryCache.put(key, JSON.stringify(data), expiry && expiry* 1000)
  }
  
  clear(key?: string){
    if(typeof key === "undefined") memoryCache.clear();
    else memoryCache.del(key);
  }
}