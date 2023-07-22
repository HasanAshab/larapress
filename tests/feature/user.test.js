const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const User = require("app/models/User").default;

describe("user", () => {
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
  
  it("Admin should get all users", async () => {
    const users = await User.factory(3).create();
    const response = await request
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(users);
  });
  
  it("General user shouldn't get all users", async () => {
    const users = await User.factory(3).create();
    const response = await request
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${users[0].createToken()}`)
    expect(response.statusCode).toBe(401);
  });
  
  it("Should get user by id", async () => {
    const user = await User.factory().create();
    const response = await request
      .get("/api/v1/users/" + user._id)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(user);
  });
  
  it("Admin should delete user", async () => {
    const user = await User.factory().create();
    const response = await request
      .delete("/api/v1/users/" + user._id)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
    expect(await User.findById(user._id)).toBeNull();
  });
  
  it("Admin should delete own account", async () => {
    const response = await request
      .delete("/api/v1/users/" + admin._id)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
    expect(await User.findById(admin._id)).toBeNull();
  });
  
  it("General user should delete own account", async () => {
    const user = await User.factory().create();
    const response = await request
      .delete("/api/v1/users/" + user._id)
      .set("Authorization", `Bearer ${user.createToken()}`);

    expect(response.statusCode).toBe(204);
    expect(await User.findById(user._id)).toBeNull();
  });
  
  it("Shouldn't delete admin user", async () => {
    const user = await User.factory().create({ isAdmin: true });
    const response = await request
      .delete("/api/v1/users/" + user._id)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(401);
    expect(await User.findById(user._id)).not.toBeNull();
  });
  
  it("General user shouldn't delete other user", async () => {
    const user = await User.factory(2).create();
    const response = await request
      .delete("/api/v1/users/" + user[1]._id)
      .set("Authorization", `Bearer ${user[0].createToken()}`);

    expect(response.statusCode).toBe(401);
    expect(await User.findById(user[1]._id)).not.toBeNull();
  });
    
  it("Should make admin", async () => {
    let user = await User.factory().create();
    const response = await request
      .put(`/api/v1/users/${user._id}/make-admin`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    user = await User.findById(user._id);
    expect(user.isAdmin).toBe(true);
  });
  
  it("General user Should't make admin", async () => {
    let users = await User.factory(2).create();
    const response = await request
      .put(`/api/v1/users/${users[1]._id}/make-admin`)
      .set("Authorization", `Bearer ${users[0].createToken()}`);
    expect(response.statusCode).toBe(401);
    const user = await User.findById(users[1]._id);
    expect(user.isAdmin).toBe(false);
  });
});
