import CacheDriver from "~/core/utils/Cache/CacheDriver";
import memoryCache from "memory-cache";
import { CacheDataArg } from "Cache";

export default class MemoryDriver implements CacheDriver {
  async get(key: string) {
    return memoryCache.get(key);
  }
  
  async put(key: string, data: CacheDataArg, expiry?: number) {
    data = typeof data === "string" 
      ? data
      : JSON.stringify(data);
    memoryCache.put(key, data, expiry && expiry * 1000)
  }
  
  async delete(key: string){
    memoryCache.del(key);
  }
  
  async increment(key: string, value = 1) {
    const currentValue = memoryCache.get(key);
    let newValue = (parseInt(currentValue) || 0) + value;
    memoryCache.put(key, newValue.toString());
    return newValue;
  }
  
  async decrement(key: string, value = 1) {
    const currentValue = memoryCache.get(key);
    let newValue = (parseInt(currentValue) || 0) - value;
    memoryCache.put(key, newValue.toString());
    return newValue;
  }
  
  async flush(){
    memoryCache.clear();
  }
}