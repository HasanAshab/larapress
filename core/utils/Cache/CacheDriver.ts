export type CacheData = string | number | boolean | CacheData[] | Record<string, CacheData>;
export type Resolver = () => CacheData | Promise<CacheData>;

export default abstract class CacheDriver {
  abstract get(key: string, deserialize?: boolean): Promise<CacheData | null>;
  abstract put<T extends CacheData>(key: string, data: T, expiry?: number, returnSerialized?: boolean): Promise<T>;
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
  
  async remember(key: string, expiry: number, resolver: Resolver) {
    return await this.get(key) ?? 
      await this.put(key, await resolver(), expiry);
  }
  
  async rememberSerialized(key: string, expiry: number, resolver: Resolver) {
    return await this.get(key, false) ?? 
      await this.put(key, await resolver(), expiry, true);
  }
  
  async rememberForever(key: string, resolver: Resolver) {
    return await this.get(key) ?? 
      await this.put(key, await resolver());
  }
  
  async rememberSerializedForever(key: string, resolver: Resolver) {
    return await this.get(key, false) ?? 
      await this.put(key, await resolver(), undefined, true);
  }
  

  protected serialize(data: CacheData) {
    return typeof data !== "string"
      ? JSON.stringify(data)
      : data;
  }
  
  protected deserialize(data: CacheData) {
    return data && typeof data === "string"
      ? JSON.parse(data)
      : data;
  }
}