const app = require(base("main/app"));
const DB = require(base("illuminate/utils/DB"));


describe("mail", () => {
  beforeEach(async () => {
    //await resetDatabase();
  })

  it("Should work", async () => {
    expect(true).toBe(true);
  });
});
