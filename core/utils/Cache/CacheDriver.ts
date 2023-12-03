export type CacheData = string | number | boolean | CacheData[] | Record<string, CacheData>;

export default abstract class CacheDriver {
  abstract get(key: string): Promise<string | null>;
  abstract put(key: string, data: CacheData, expiry?: number): Promise<void>;
  abstract delete(key: string): Promise<void>;
  abstract increment(key: string): Promise<number>;
  abstract decrement(key: string): Promise<number>;
  abstract flush(): Promise<void>;
  
  async increment(key: string) {
    const currentValue = this.get(key);
    const newValue = (parseInt(currentValue) || 0) + 1;
    this.put(key, newValue.toString());
    return newValue;
  }
  
  async decrement(key: string) {
    const currentValue = this.get(key);
    const newValue = (parseInt(currentValue) || 0) - 1;
    this.put(key, newValue.toString());
    return newValue;
  }
  
  async remember(key: string, expiry: number, resolver: (() => CacheData | Promise<CacheData>)) {
    return await this.get(key) ?? 
      await this.put(key, await resolver(), expiry);
  }
  
  async rememberForever(key: string, resolver: (() => CacheData | Promise<CacheData>)) {
    return await this.get(key) ?? 
      await this.put(key, await resolver());
  }
}