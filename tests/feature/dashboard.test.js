const DB = require("DB").default;
const User = require("~/app/models/User").default;

describe("Dashboard", () => {
  let admin;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await DB.reset();
    admin = await User.factory().create({ role: "admin" });
    token = admin.createToken();
  });
  
  it("General users shouldn't get admin dashboard", async () => {
    const user = await User.factory().create();
    const response = await request
      .get("/api/v1/dashboard/admin")
      .set("Authorization", `Bearer ${user.createToken()}`);
    expect(response.statusCode).toBe(403);
  });
  
  it("Admin should get dashboard", async () => {
    const todayUser = await User.factory({ count: 2 }).create();
    const oldUser = await User.factory({ count: 3 }).create({createdAt: new Date(2022, 0, 1)});
    const response = await request
      .get("/api/v1/dashboard/admin")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.totalUsers).toBe(5);
    expect(response.body.data.newUsersToday).toBe(2);
  });
});
