const DB = require("DB").default;
const User = require("~/app/models/User").default;
const Storage = require("Storage").default;
const Mail = require("Mail").default;

describe("user", () => {
  let user;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await DB.reset();
    user = await User.factory().create();
    token = user.createToken();
    Mail.mock();
  });
  
  it("Admin should get all users", async () => {
    const admin = await User.factory({ events: false }).create({ role: "admin" });
    const users = await User.factory({ count: 3, events: false }).create();
    users.unshift(user);
    const response = await request
      .get("/users")
      .set("Authorization", `Bearer ${admin.createToken()}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(users);
  });
  
  it("General user shouldn't get all users", async () => {
    const users = await User.factory({ count: 3, events: false }).create();
    const response = await request
      .get("/users")
      .set("Authorization", `Bearer ${users[0].createToken()}`)
    expect(response.statusCode).toBe(403);
  });
  
  it("should get profile", async () => {
    const response = await request
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    delete user.password;
    expect(response.body.data).toEqualDocument(user);
  });

  it("should update profile", async () => {
    Storage.mock();
    const response = await request
      .put("/users/me")
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
      .put("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .field("username", "newName");
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe("newName");
    Mail.assertNothingSent();
    Storage.assertNothingStored();
  });

  it("Shouldn't update profile with existing username", async () => {
    const randomUser = await User.factory({ events: false }).create();
    const response = await request
      .put("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .field("username", randomUser.username);

    const userAfterRequest = await User.findById(user._id);
    expect(response.statusCode).toBe(400);
    expect(userAfterRequest.username).toBe(user.username);
    Mail.assertNothingSent();
  });

  it("Shouldn't update profile with existing email", async () => {
    const randomUser = await User.factory({ events: false }).create();
    const response = await request
      .put("/users/me")
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
      .put("/users/me")
      .set("Authorization", `Bearer ${token}`)
      .field("username", newUserData.username)
      .field("email", newUserData.email)
      .attach("logo", fakeFile("image.png"));
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe(newUserData.username);
    expect(user.email).toBe(newUserData.email);
    await new Promise((resolve) => {
      setTimeout(() => {
        Mail.assertCount(1);
        Mail.assertSentTo(user.email, "VerificationMail");
        resolve();
      }, 3000);
    });
    Storage.assertStoredCount(1);
    Storage.assertStored("image.png");
  });

  it("Should get user profile by username", async () => {
    const user = await User.factory({ events: false }).create();
    const response = await request
      .get("/users/" + user.username)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(user.safeDetails());
  });
  
  it("Admin should delete user", async () => {
    const admin = await User.factory({ events: false }).create({ role: "admin" });
    const response = await request
      .delete("/users/" + user.username)
      .set("Authorization", `Bearer ${admin.createToken()}`);
    expect(response.statusCode).toBe(204);
    expect(await User.findById(user._id)).toBeNull();
  });
  
  it("Admin should delete own account", async () => {
    const admin = await User.factory({ events: false }).create({ role: "admin" });
    const response = await request
      .delete("/users/" + admin.username)
      .set("Authorization", `Bearer ${admin.createToken()}`);

    expect(response.statusCode).toBe(204);
    expect(await User.findById(admin._id)).toBeNull();
  });
  
  it("General user should delete own account", async () => {
    const user = await User.factory({ events: false }).create();
    const response = await request
      .delete("/users/" + user.username)
      .set("Authorization", `Bearer ${user.createToken()}`);

    expect(response.statusCode).toBe(204);
    expect(await User.findById(user._id)).toBeNull();
  });
  
  it("Shouldn't delete admin user", async () => {
    const admin = await User.factory({ events: false }).create({ role: "admin" });
    const response = await request
      .delete("/users/" + admin.username)
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(403);
    expect(await User.findById(admin._id)).not.toBeNull();
  });
  
  it("General user shouldn't delete other user", async () => {
    const user = await User.factory({ count: 2, events: false }).create();
    const response = await request
      .delete("/users/" + user[1].username)
      .set("Authorization", `Bearer ${user[0].createToken()}`);

    expect(response.statusCode).toBe(403);
    expect(await User.findById(user[1]._id)).not.toBeNull();
  });
    
  it("Should make admin", async () => {
    const admin = await User.factory({ events: false }).create({ role: "admin" });
    const response = await request
      .put(`/users/${user.username}/make-admin`)
      .set("Authorization", `Bearer ${admin.createToken()}`);
    expect(response.statusCode).toBe(200);
    user = await User.findById(user._id);
    expect(user.role).toBe("admin");
  });
  
  it("General user Should't make admin", async () => {
    let user = await User.factory({ events: false }).create();
    const response = await request
      .put(`/users/${user.username}/make-admin`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
    user = await User.findById(user._id);
    expect(user.role).toBe("novice");
  });
});
