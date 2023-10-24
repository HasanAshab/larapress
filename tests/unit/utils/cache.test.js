const Cache = require("Cache").default;
const config = require("config");

describe("Cache", () => {
  const stores = Object.keys(config.get("cache.stores"));
  beforeEach(async () => {
    for(const storeName of stores){
      await Cache.store(storeName).delete("key");
    }
  });
  
  
  it("Should cache with default store", async () => {
    await Cache.put("key", "data");
    expect(await Cache.store("memory").get("key")).toBe("data");
    expect(await Cache.store("redis").get("key")).toBeNull();
  });
  
  it("Should reset to default store", async () => {
    await Cache.store("redis").put("key", "data");
    await Cache.put("key2", "data2");
    expect(await Cache.store("memory").get("key2")).toBe("data2");
  });
  
  it("Should cache", async () => {
    for(const storeName of stores){
      await Cache.store(storeName).put("key", "data")
      expect(await Cache.store(storeName).get("key")).toBe("data");
    }
  });
  
  it("Should delete cache", async () => {
    for(const storeName of stores){
      await Cache.store(storeName).put("key", "data")
      await Cache.store(storeName).delete("key")
      expect(await Cache.store(storeName).get("key")).toBe(null);
    }
  });
  
  it("Should store cache with expiry time", async () => {
    for(const storeName of stores){
      await Cache.store(storeName).put("key", "data", 10)
      expect(await Cache.store(storeName).get("key")).toBe("data");
    }
  });
  
  it("Shouldn't get expired cache", async () => {
    for(const storeName of stores){
      await Cache.store(storeName).put("key", "data", 1)
    }
    await sleep(1002);
    for(const storeName of stores){
      expect(await Cache.store(storeName).get("key")).toBe(null);
    }
  });
});
