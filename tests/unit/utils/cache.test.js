const Cache = require(base("illuminate/utils/Cache")).default;


describe("cache", () => {
  it("Should store cache", async () => {
    await Cache.put("key", "data")
    expect(await Cache.get("key")).toBe("data");
  });
  
});
