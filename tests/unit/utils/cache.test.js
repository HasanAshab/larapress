const app = require(base("main/app"));
const DB = require(base("illuminate/utils/DB"));


describe("cache", () => {
  beforeEach(async () => {
    //await resetDatabase();
  })

  it("Should work", async () => {
    expect(true).toBe(true);
  });
});
