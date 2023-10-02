import { CacheDataArg } from "Cache";

export default abstract class Driver {
  abstract get(key: string): Promise<string | null>;
  abstract put(key: string, data: CacheDataArg, expiry?: number): Promise<void>;
  abstract clear(key?: string): Promise<void>;
}