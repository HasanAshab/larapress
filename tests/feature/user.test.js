const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const User = require("app/models/User").default;
const Storage = require("illuminate/utils/Storage").default;

describe("user", () => {
  let admin;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await resetDatabase();
    admin = await User.factory().create({ role: "admin" });
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
    expect(response.statusCode).toBe(403);
  });
  
  it("should get profile", async () => {
    const response = await request
      .get("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    delete user.password;
    expect(response.body.data).toEqualDocument(user);
  });

  it("should update profile", async () => {
    Storage.mock();
    const response = await request
      .put("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`)
      .field("username", "newName")
      .attach("logo", fakeFile("image.png"));
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe("newName");
    Mail.assertNothingSent();
    Storage.assertStoredCount(1);
    Storage.assertStored("image.png");
  });

  it("Should update profile without logo", async () => {
    Storage.mock();
    const response = await request
      .put("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`)
      .field("username", "newName");
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe("newName");
    Mail.assertNothingSent();
    Storage.assertNothingStored();
  });

  it("Shouldn't update profile with existing username", async () => {
    const randomUser = await User.factory().create();
    const response = await request
      .put("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`)
      .field("username", randomUser.username);

    const userAfterRequest = await User.findById(user._id);
    expect(response.statusCode).toBe(400);
    expect(userAfterRequest.username).toBe(user.username);
    Mail.assertNothingSent();
  });

  it("Shouldn't update profile with existing email", async () => {
    const randomUser = await User.factory().create();
    const response = await request
      .put("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`)
      .field("email", randomUser.email);

    const userAfterRequest = await User.findById(user._id);
    expect(response.statusCode).toBe(400);
    expect(userAfterRequest.email).toBe(user.email);
    Mail.assertNothingSent();
  });

  it("updating email should send verification email", async () => {
    const newUserData = {
      username: "changed",
      email: "changed@gmail.com",
    };
    Storage.mock();
    const response = await request
      .put("/api/v1/users/me")
      .set("Authorization", `Bearer ${token}`)
      .field("username", newUserData.username)
      .field("email", newUserData.email)
      .attach("logo", fakeFile("image.png"));
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe(newUserData.username);
    expect(user.email).toBe(newUserData.email);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "VerificationMail");
    Storage.assertStoredCount(1);
    Storage.assertStored("image.png");
  });

  it("Should get user profile by username", async () => {
    const user = await User.factory().create();
    const response = await request
      .get("/api/v1/users/" + user.username)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(user.safeDetails());
  });
  
  it("Admin should delete user", async () => {
    const user = await User.factory().create();
    const response = await request
      .delete("/api/v1/users/" + user.username)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
    expect(await User.findById(user._id)).toBeNull();
  });
  
  it("Admin should delete own account", async () => {
    const response = await request
      .delete("/api/v1/users/" + admin.username)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(204);
    expect(await User.findById(admin._id)).toBeNull();
  });
  
  it("General user should delete own account", async () => {
    const user = await User.factory().create();
    const response = await request
      .delete("/api/v1/users/" + user.username)
      .set("Authorization", `Bearer ${user.createToken()}`);

    expect(response.statusCode).toBe(204);
    expect(await User.findById(user._id)).toBeNull();
  });
  
  it("Shouldn't delete admin user", async () => {
    const user = await User.factory().create({ role: "admin" });
    const response = await request
      .delete("/api/v1/users/" + user.username)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
    expect(await User.findById(user._id)).not.toBeNull();
  });
  
  it("General user shouldn't delete other user", async () => {
    const user = await User.factory(2).create();
    const response = await request
      .delete("/api/v1/users/" + user[1].username)
      .set("Authorization", `Bearer ${user[0].createToken()}`);

    expect(response.statusCode).toBe(403);
    expect(await User.findById(user[1]._id)).not.toBeNull();
  });
    
  it("Should make admin", async () => {
    let user = await User.factory().create();
    const response = await request
      .put(`/api/v1/users/${user.username}/make-admin`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    user = await User.findById(user._id);
    expect(user.role).toBe("admin");
  });
  
  it("General user Should't make admin", async () => {
    let users = await User.factory(2).create();
    const response = await request
      .put(`/api/v1/users/${users[1].username}/make-admin`)
      .set("Authorization", `Bearer ${users[0].createToken()}`);
    expect(response.statusCode).toBe(403);
    const user = await User.findById(users[1]._id);
    expect(user.role).toBe("novice");
  });
});
