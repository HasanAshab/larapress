import CacheDriver, { CacheData } from "../CacheDriver";
import memoryCache from "memory-cache";

export default class MemoryDriver extends CacheDriver {
  async get(key: string) {
    return memoryCache.get(key);
  }
  
  async put(key: string, data: CacheData, expiry?: number) {
    data = typeof data === "string" 
      ? data
      : JSON.stringify(data);
    memoryCache.put(key, data, expiry && expiry * 1000)
  }
  
  async delete(key: string){
    memoryCache.del(key);
  }
  
  async flush(){
    memoryCache.clear();
  }
}