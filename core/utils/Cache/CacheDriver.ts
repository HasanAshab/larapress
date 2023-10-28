type CacheData = string | number | object | boolean | CacheData[];

export default interface CacheDriver {
  get(key: string): Promise<string | null>;
  put(key: string, data: CacheData, expiry?: number): Promise<void>;
  delete(key: string): Promise<void>;
  increment(key: string, value?: number): Promise<number>;
  decrement(key: string, value?: number): Promise<number>;
  flush(): Promise<void>;
}