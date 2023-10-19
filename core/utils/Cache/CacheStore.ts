import { CacheDataArg } from "Cache";

export default interface CacheStore {
  store: string;
  get(key: string): Promise<string | null>;
  put(key: string, data: CacheDataArg, expiry?: number): Promise<void>;
  delete(key: string): Promise<void>;
  increment(key: string, value?: number): Promise<number>;
  decrement(key: string, value?: number): Promise<number>;
  flush(): Promise<void>;
}