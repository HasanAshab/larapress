const app = require("main/app").default;
const request = require("supertest")(app.listen(8000));
const DB = require("illuminate/utils/DB").default;
const URL = require("illuminate/utils/URL").default;
const bcrypt = require("bcryptjs");
const Storage = require("illuminate/utils/Storage").default;
const Mail = require("illuminate/utils/Mail").default;
const User = require("app/models/User").default;
const events = require("events");

describe("Auth", () => {
  let user;
  let token;

  beforeAll(async () => {
    Mail.mock();
    Storage.mock();
  });

  beforeEach(async () => {
    await resetDatabase();
    Mail.mocked.reset();
    Storage.mocked.reset();
    user = await User.factory().create();
    token = user.createToken();
  });

  it("should register a user", async () => {
    const dummyUser = await User.factory().dummyData();
    const mockListener = jest.fn();
    app.on("Registered", mockListener);
    const response = await request
      .post("/api/v1/auth/register")
      .field("name", dummyUser.name)
      .field("email", dummyUser.email)
      .field("password", dummyUser.password)
      .field("password_confirmation", dummyUser.password)
      .attach("logo", fakeFile("image.png"));
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("token");
    expect(mockListener).toHaveBeenCalledTimes(1);
    const { total: totalFile, files } = Storage.mocked.data;
    expect(totalFile).toBe(1);
    expect(files).toHaveProperty(["image.png"]);
  });

  it("should login a user", async () => {
    const response = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "password");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });

  it("should verify email", async () => {
    const verificationLink = await user.sendVerificationEmail();
    const response = await fetch(verificationLink)
    user = await User.findById(user._id);
    expect(response.status).toBe(200);
    expect(user.emailVerified).toBe(true);
  });
  
  it("shouldn't verify email without signature", async () => {
    const verificationLink = URL.route("email.verify");
    const response = await fetch(verificationLink);
    user = await User.findById(user._id);
    expect(response.status).toBe(401);
    expect(user.emailVerified).toBe(false);
  });

  it("should resend verification email", async () => {
    const response = await request
      .post("/api/v1/auth/verify/resend")
      .field("email", user.email);
    expect(response.statusCode).toBe(200);
    const { total, recipients } = Mail.mocked.data;
    expect(total).toBe(1);
    expect(recipients).toHaveProperty([user.email, "verification"]);
  });

  it("should get user details", async () => {
    const response = await request
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.email).toBe(user.email);
  });
  
  it("shouldn't get user details without token", async () => {
    const response = await request
      .get("/api/v1/auth/profile")
    expect(response.statusCode).toBe(401);
  });

  it("should update user details", async () => {
    const newUserData = {
      name: "changed",
      email: "changed@gmail.com",
    };
    const response = await request
      .put("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`)
      .field("name", newUserData.name)
      .field("email", newUserData.email)
      .attach("logo", fakeFile("image.png"));
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.name).toBe(newUserData.name);
    expect(user.email).toBe(newUserData.email);
    const { total: totalMail, recipients } = Mail.mocked.data;
    expect(totalMail).toBe(1);
    expect(recipients).toHaveProperty([user.email, "verification"]);

    const { total: totalFile, files } = Storage.mocked.data;
    expect(totalFile).toBe(1);
    expect(files).toHaveProperty(["image.png"]);
  });
  
  it("shouldn't update user details without token", async () => {
    const newUserData = {
      name: "changed",
      email: "changed@gmail.com",
    };
    const response = await request
      .put("/api/v1/auth/profile")
      .field("name", newUserData.name)
      .field("email", newUserData.email)
      .attach("logo", fakeFile("image.png"));
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(401);
  });

  it("should change password", async () => {
    const passwords = {
      old: "password",
      new: "new-password",
    };
    const response = await request
      .put("/api/v1/auth/password/change")
      .set("Authorization", `Bearer ${token}`)
      .field("old_password", passwords.old)
      .field("password", passwords.new);

    user = await User.findById(user._id);
    const passwordMatch = await bcrypt.compare(passwords.new, user.password);
    expect(response.statusCode).toBe(200);
    expect(passwordMatch).toBe(true);
    const { total, recipients } = Mail.mocked.data;
    expect(total).toBe(1);
    expect(recipients).toHaveProperty([user.email, "passwordChanged"]);
  });
  
  it("shouldn't change password, if same to old and new passwords are same", async () => {
    const response = await request
      .put("/api/v1/auth/password/change")
      .set("Authorization", `Bearer ${token}`)
      .field("old_password", "password")
      .field("password", "password");
    expect(response.statusCode).toBe(400);
    expect(Mail.mocked.data.total).toBe(0);
  });

  it("forgoting password should sent reset email", async () => {
    const response = await request
      .post("/api/v1/auth/password/forgot")
      .field("email", user.email);
    expect(response.statusCode).toBe(200);
    const { total, recipients } = Mail.mocked.data;
    expect(total).toBe(1);
    expect(recipients).toHaveProperty([user.email, "forgotPassword"]);
  });

  it("should reset password", async () => {
    const resetToken = await user.sendResetPasswordEmail();
    Mail.mocked.reset();
    const newPassword = "new-password";
    const response = await request
      .put("/api/v1/auth/password/reset")
      .field("id", user._id.toString())
      .field("password", newPassword)
      .field("token", resetToken);

    user = await User.findById(user._id);
    const passwordMatch = await bcrypt.compare(newPassword, user.password);
    expect(response.statusCode).toBe(200);
    expect(passwordMatch).toBe(true);
    const { total, recipients } = Mail.mocked.data;
    expect(total).toBe(1);
    expect(recipients).toHaveProperty([user.email, "passwordChanged"]);
  });
  
  it.only("shouldn't reset password with invalid token", async () => {
    const newPassword = "new-password";
    const response = await request
      .put("/api/v1/auth/password/reset")
      .field("id", user._id.toString())
      .field("password", newPassword)
      .field("token", "foo");

    user = await User.findById(user._id);
    const passwordMatch = await bcrypt.compare(newPassword, user.password);
    expect(response.statusCode).toBe(401);
    expect(passwordMatch).toBe(false);
    expect(Mail.mocked.data.total).toBe(0);
  });
});
