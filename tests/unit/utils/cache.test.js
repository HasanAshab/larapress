const Cache = require("illuminate/utils/Cache").default;
const cacheDriversConfig = require("register/drivers/cache").default;

describe("Cache", () => {
  beforeAll(async () => {
    for(const driver of cacheDriversConfig.list){
      await Cache.driver(driver).clear();
    }
  });
  
  it("Should store cache", async () => {
    for(const driverName of cacheDriversConfig.list){
      await Cache.driver(driverName).put("key", "data")
      expect(await Cache.driver(driverName).get("key")).toBe("data");
    }
  });
  
  it("Should delete cache", async () => {
    for(const driverName of cacheDriversConfig.list){
      await Cache.driver(driverName).put("key", "data")
      await Cache.driver(driverName).clear("key")
      expect(await Cache.driver(driverName).get("key")).toBe(null);
    }
  });
  
  it("Should store cache with expiry time", async () => {
    for(const driverName of cacheDriversConfig.list){
      await Cache.driver(driverName).put("key", "data", 10 * 1000)
      expect(await Cache.driver(driverName).get("key")).toBe("data");
    }
  });
  
  it("Shouldn't get expired cache", async () => {
    for(const driverName of cacheDriversConfig.list){
      await Cache.driver(driverName).put("key", "data", 1000)
    }
    setTimeout(async () => {
      for(const driverName of cacheDriversConfig.list){
        expect(await Cache.driver(driverName).get("key")).toBe(null);
      }
    }, 1000)
  });
});
