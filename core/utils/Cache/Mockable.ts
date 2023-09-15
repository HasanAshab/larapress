import { CacheDataArg } from "Cache";
import expect from "expect";

export default class Mockable {
  static isMocked = false;
  static mocked = {
    get: [] as string[],
    put: {} as Record<string, {data: CacheDataArg, expiry?: number}>,
    clear: {
      all: 0,
      keys: [] as string[]
    }
  };
  
  static mock() {
    this.isMocked = true;
    this.mocked = {
      get: [],
      put: {},
      clear: {
        all: 0,
        keys: []
      }
    };
  }
  
  static getLogger(key: string) {
    this.mocked.get.push(key);
  }

  static putLogger(key: string, data: CacheDataArg, expiry?: number) {
    this.mocked.put[key] = {data, expiry};
  }

  static clearLogger(key?: string) {
    typeof key === "string" 
      ? this.mocked.clear.keys.push(key)
      : this.mocked.clear.all++;
  }
  
  static assertFetched(keys: string | string[]){
    keys = Array.isArray(keys) ? keys: [keys];
    expect(this.mocked.get).toEqual(expect.arrayContaining(keys));
  }
  
  static assertStored(key: string, data: CacheDataArg, expiry?: number){
    expect(this.mocked.put[key]).toEqual({data, expiry});
  }
  
  static assertCleared(keys: string | string[]){
    keys = Array.isArray(keys) ? keys: [keys];
    expect(this.mocked.clear.keys).toEqual(expect.arrayContaining(keys));
  }
  
  static assertClearedAll(){
    expect(this.mocked.clear.all).not.toBe(0);
  }
}