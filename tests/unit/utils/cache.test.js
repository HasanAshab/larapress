const Cache = require("Cache").default;
const { drivers } = require("~/register/cache").default;

describe("Cache", () => {
  beforeAll(async () => {
    for(const driver of drivers){
      await Cache.driver(driver).clear();
    }
  });
  
  it("Should store cache", async () => {
    for(const driverName of drivers){
      await Cache.driver(driverName).put("key", "data")
      expect(await Cache.driver(driverName).get("key")).toBe("data");
    }
  });
  
  it("Should delete cache", async () => {
    for(const driverName of drivers){
      await Cache.driver(driverName).put("key", "data")
      await Cache.driver(driverName).clear("key")
      expect(await Cache.driver(driverName).get("key")).toBe(null);
    }
  });
  
  it("Should store cache with expiry time", async () => {
    for(const driverName of drivers){
      await Cache.driver(driverName).put("key", "data", 10 * 1000)
      expect(await Cache.driver(driverName).get("key")).toBe("data");
    }
  });
  
  it("Shouldn't get expired cache", async () => {
    for(const driverName of drivers){
      await Cache.driver(driverName).put("key", "data", 1000)
    }
    await new Promise(resolve => {
      setTimeout(async () => {
        for(const driverName of drivers){
          expect(await Cache.driver(driverName).get("key")).toBe(null);
        }
        resolve();
      }, 1000);
    });
  });
});
