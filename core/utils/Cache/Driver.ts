import { CacheDataArg } from "Cache";

export default abstract class Driver {
  abstract get(key: string): Promise<string | null> | string | null;
  abstract put(key: string, data: CacheDataArg, expiry?: number): Promise<void> | void;
  abstract clear(key?: string): Promise<void> | void;
}