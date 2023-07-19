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
  
  it("Shouldn't accessable by general users", async () => {
    const user = await User.factory().create();
    const userToken = user.createToken();
    const responses = [
      request.get("/api/v1/admin/users"),
      request.get("/api/v1/admin/users/foo-user-id"),
      request.put("/api/v1/admin/users/foo-user-id"),
      request.delete("/api/v1/admin/users/foo-user-id")
    ]
    const isNotAccessable = responses.every(async (response) => {
      return await response.set("Authorization", `Bearer ${userToken}`).statusCode === 401;
    });
    expect(isNotAccessable).toBe(true);
  })


  it("Should get users", async () => {
    const users = await User.factory(3).create();
    const response = await request
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(users);
  });
  
  it("Should get user by id", async () => {
    const user = await User.factory().create();
    const response = await request
      .get("/api/v1/admin/users/" + user._id)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(user);
  });
});
