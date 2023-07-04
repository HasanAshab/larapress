const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const Notification = require

describe("Notification", () => {
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await resetDatabase();
  });

  it("Should get notifications", async () => {
    const response = await request.get("/api/v1/notifications");
    console.log(response.body)
    expect(true).toBe(true);
  });
});
