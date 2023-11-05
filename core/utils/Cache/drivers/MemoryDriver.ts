import CacheDriver, { CacheData } from "~/core/utils/Cache/CacheDriver";
import memoryCache from "memory-cache";

export default class MemoryDriver implements CacheDriver {
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
  
  async increment(key: string) {
    const currentValue = memoryCache.get(key);
    const newValue = (parseInt(currentValue) || 0) + 1;
    memoryCache.put(key, newValue.toString());
    return newValue;
  }
  
  async decrement(key: string) {
    const currentValue = memoryCache.get(key);
    const newValue = (parseInt(currentValue) || 0) - 1;
    memoryCache.put(key, newValue.toString());
    return newValue;
  }
  
  async flush(){
    memoryCache.clear();
  }
}