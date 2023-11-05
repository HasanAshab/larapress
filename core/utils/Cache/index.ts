import CacheManager from "./CacheManager";

export type { default as CacheDriver } from "./CacheDriver";
export default resolve<CacheManager>("Cache");