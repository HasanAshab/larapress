const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const User = require("app/models/User").default;

describe("admin", () => {
  let admin;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await resetDatabase();
    admin = await User.factory().create({isAdmin: true});
    token = admin.createToken();
  });
  

  
  it("Should get categories", async () => {
    const users = await User.factory(3).create();
    const response = await request
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(users);
  });
});
