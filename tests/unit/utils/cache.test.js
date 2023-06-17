const Cache = require("illuminate/utils/Cache").default;


describe("Cache", () => {
  const drivers = ["memory", "redis"];
  
  beforeAll(async () => {
    for(const driver of drivers){
      await Cache.driver(driver).clear()
    }
  });
  
  it("Should store cache", async () => {
    for(const driverName of drivers){
      await Cache.driver(driverName).put("key", "data")
      expect(await Cache.driver(driverName).get("key")).toBe("data");
    }
  });
  
  it("Should store cache with expiry time", async () => {
    for(const driverName of drivers){
      await Cache.driver(driverName).put("key", "data", 10 * 1000)
      expect(await Cache.driver(driverName).get("key")).toBe("data");
    }
  });
  
  it.skip("Shouldn't get expired cache", async () => {
    for(const driverName of drivers){
      await Cache.driver(driverName).put("key", "data")
      console.log(await Cache.driver(driverName).get("key"))
      expect(await Cache.driver(driverName).get("key")).toBe("data");
    }
  });
});
