const app = require(base("main/app"));
const DB = require(base("illuminate/utils/DB"));
const Storage = require(base("illuminate/utils/Storage"));


describe("storage", () => {
  beforeEach(async () => {
    //await resetDatabase();
  })

  it("Should work", async () => {
    expect(true).toBe(true);
  });
});
