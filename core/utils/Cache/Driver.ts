import { CacheDataArg } from "types";

export default interface Driver {
  get(key: string): Promise<string | null> | string | null;
  put(key: string, data: CacheDataArg, expiry?: number): Promise<void> | void;
  clear(key?: string): Promise<void> | void;
}