const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;

describe("category", () => {
  beforeAll(async () => {
    //await DB.connect();
  });
  
  beforeEach(async () => {
    //await resetDatabase();
  });

  it("Should work", async () => {
    const response = await request.get("/");
    expect(true).toBe(true);
  });
});
