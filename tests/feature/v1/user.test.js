const DB = require("DB").default;
const User = require("~/app/models/User").default;
const Storage = require("Storage").default;
const Notification = require("Notification").default;
const EmailVerificationNotification = require("~/app/notifications/EmailVerificationNotification").default;

describe("user", () => {
  let user;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async (config) => {
    await DB.reset();
    Notification.mockClear();
    Storage.mockClear();
    if(config.user !== false) {
      user = await User.factory().create();
      token = user.createToken();
    }
  });
  
  it("Admin should get all users", { user: false }, async () => {
    const [admin, users] = await Promise.all([
      User.factory().withRole("admin").create(),
      User.factory().count(2).create()
    ]);
    const response = await request.get("/users").actingAs(admin.createToken());
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(users);
  });
  
  it("Novice user shouldn't get all users", async () => {
    const response = await request.get("/users").actingAs(token);
    expect(response.statusCode).toBe(403);
    expect(response.body).not.toHaveProperty("data");
  });
  
  it("should get profile", async () => {
    const response = await request.get("/users/me").actingAs(token);
    expect(response.statusCode).toBe(200);
    delete user.password;
    expect(response.body.data).toEqualDocument(user);
  });

  it("should update profile", async () => {
    const response = await request.patch("/users/me").actingAs(token).multipart({
      username: "newName",
      profile: fakeFile("image.png")
    });
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe("newName");
    Notification.assertNothingSent();
    Storage.assertStoredCount(1);
    Storage.assertStored("image.png");
  });

  it("Should update profile without profile", async () => {
    const response = await request.patch("/users/me").actingAs(token).multipart({ username: "newName" });
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.username).toBe("newName");
    Storage.assertNothingStored();
  });

  it("Shouldn't update profile with existing username", async () => {
    const existingUser = await User.factory().create();
    const usernameBefore = user.username;
    const response = await request.patch("/users/me").actingAs(token).send({ username: existingUser.username });
    await user.refresh();
    expect(response.statusCode).toBe(400);
    expect(user.username).toBe(usernameBefore);
  });

  it("Shouldn't update profile with existing email", async () => {
    const existingUser = await User.factory().create();
    const response = await request.patch("/users/me").actingAs(token).multipart({ email: existingUser.email });
    const userAfterRequest = await User.findById(user._id);
    expect(response.statusCode).toBe(400);
    expect(userAfterRequest.email).toBe(user.email);
    Notification.assertNothingSent();
  });

  it.only("updating email should send verification email", async () => {
    const email = "foo@test.com";
    const response = await request.patch("/users/me").actingAs(token).multipart({ email });
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.email).toBe(email);
    Notification.assertSentTo(user, EmailVerificationNotification);
  });

  it("Should get other user's profile by username", async () => {
    const otherUser = await User.factory().create();
    const response = await request.get("/users/" + otherUser.username).actingAs(token);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(otherUser.safeDetails());
  });

  it("Should delete own account", async () => {
    const response = await request.delete("/users/" + user.username).actingAs(token);
    expect(response.statusCode).toBe(204);
    expect(await User.findById(user._id)).toBeNull();
  });
  
  it("Admin should delete user", async () => {
    const admin = await User.factory().withRole("admin").create();
    const response = await request.delete("/users/" + user.username).actingAs(admin.createToken());
    expect(response.statusCode).toBe(204);
    expect(await User.findById(user._id)).toBeNull();
  });

  it("Shouldn't delete admin user", async () => {
    const admin = await User.factory().withRole("admin").create();
    const response = await request.delete("/users/" + admin.username).actingAs(token);
    expect(response.statusCode).toBe(403);
    expect(await User.findById(admin._id)).not.toBeNull();
  });
  
  it("Admin shouldn't delete other admin user", { user: false }, async () => {
    const admins = await User.factory().count(2).withRole("admin").create();
    const response = await request.delete("/users/" + admins[0].username).actingAs(admins[1].createToken());
    expect(response.statusCode).toBe(403);
    expect(await User.findById(admins[0]._id)).not.toBeNull();
  });
  
  it("Novice user shouldn't delete other user", async () => {
    const anotherUser = await User.factory().create();
    const response = await request.delete("/users/" + anotherUser.username).actingAs(token);
    expect(response.statusCode).toBe(403);
    expect(await User.findById(anotherUser._id)).not.toBeNull();
  });
    
  it("Should make admin", async () => {
    const admin = await User.factory().withRole("admin").create();
    const response = await request.patch(`/users/${user.username}/make-admin`).actingAs(admin.createToken());
    expect(response.statusCode).toBe(200);
    user = await User.findById(user._id);
    expect(user.role).toBe("admin");
  });
  
  it("General user Should't make admin", async () => {
    let anotherUser = await User.factory().create();
    const response = await request.patch(`/users/${anotherUser.username}/make-admin`).actingAs(token);
    expect(response.statusCode).toBe(403);
    user = await User.findById(user._id);
    expect(anotherUser.role).toBe("novice");
  });
});
