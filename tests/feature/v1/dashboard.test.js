const DB = require("DB").default;
const User = require("~/app/models/User").default;

describe("Dashboard", () => {
  let admin;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async (config) => {
    await DB.reset();
    if(config.user !== false) {
      admin = await User.factory().create({ role: "admin" })
      token = admin.createToken();
    }
  });
  
  it("Novice users shouldn't get admin dashboard", { user: false }, async () => {
    const user = await User.factory().create();
    const response = await request.get("/dashboard/admin").actingAs(user.createToken());
    expect(response.statusCode).toBe(403);
  });
  
  it("Admin should get dashboard", async () => {
    const [todayUser, oldUser] = await Promise.all([
      User.factory(2).create(),
      User.factory(3).create({ createdAt: new Date(2022, 0, 1) })
    ]);
    const response = await request.get("/dashboard/admin").actingAs(token);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.totalUsers).toBe(5);
    expect(response.body.data.newUsersToday).toBe(2);
  });
});
