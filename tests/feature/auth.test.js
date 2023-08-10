const app = require("main/app").default;
const request = require("supertest")(app.listen(8000));
const DB = require("illuminate/utils/DB").default;
const URL = require("illuminate/utils/URL").default;
const bcrypt = require("bcryptjs");
const Cache = require("illuminate/utils/Cache").default;
const Storage = require("illuminate/utils/Storage").default;
const Mail = require("illuminate/utils/Mail").default;
const User = require("app/models/User").default;
const Settings = require("app/models/Settings").default;
const OTP = require("app/models/OTP").default;
const events = require("events");

describe("Auth", () => {
  let user;
  let token;
  beforeAll(async () => {
    await DB.connect();
  });

  beforeEach(async () => {
    await resetDatabase();
    Mail.mock();
    user = await User.factory().create();
    token = user.createToken();
  });

  it("should register a user", async () => {
    await Settings.create({ userId: user._id });
    const dummyUser = await User.factory().dummyData();
    const mockListener = jest.fn();
    app.on("Registered", mockListener);
    Storage.mock();
    const response = await request
      .post("/api/v1/auth/register")
      .field("username", dummyUser.username)
      .field("email", dummyUser.email)
      .field("password", dummyUser.password)
      .attach("logo", fakeFile("image.png"));
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("token");
    expect(await User.findOne({ email: dummyUser.email })).not.toBeNull();
    expect(mockListener).toHaveBeenCalledTimes(1);
    Storage.assertStoredCount(1);
    Storage.assertStored("image.png");
  });

  it("should register a user without logo", async () => {
    await Settings.create({ userId: user._id });
    const dummyUser = await User.factory().dummyData();
    const mockListener = jest.fn();
    app.on("Registered", mockListener);
    Storage.mock();
    const response = await request
      .post("/api/v1/auth/register")
      .field("username", dummyUser.username)
      .field("email", dummyUser.email)
      .field("password", dummyUser.password)

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("token");
    expect(await User.findOne({ email: dummyUser.email })).not.toBeNull();
    expect(mockListener).toHaveBeenCalledTimes(1);
    Storage.assertNothingStored();
  });

  it("shouldn't register with existing email", async () => {
    const response = await request
      .post("/api/v1/auth/register")
      .field("username", "foo")
      .field("email", user.email)
      .field("password", "password")

    expect(response.statusCode).toBe(400);
    expect(response.body.data).not.toHaveProperty("token");
  });

  it("shouldn't register with existing username", async () => {
    const response = await request
      .post("/api/v1/auth/register")
      .field("username", user.username)
      .field("email", "foo@samer.com")
      .field("password", "password")

    expect(response.statusCode).toBe(400);
    expect(response.body.data).not.toHaveProperty("token");
  });

  it("should login a user", async () => {
    await Settings.create({
      userId: user._id,
      twoFactorAuth: { enabled: false } 
    });
    const response = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "password");
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });

  it("shouldn't login with wrong password", async () => {
    const response = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "wrong-password");
    expect(response.statusCode).toBe(401);
    expect(response.body.data?.token).toBe(undefined);
  });

  it("shouldn't login manually in OAuth account", async () => {
    const OAuthUser = await User.factory().create({ password: null });
    const response = await request
      .post("/api/v1/auth/login")
      .field("email", OAuthUser.email)
      .field("password", "password");
    expect(response.statusCode).toBe(401);
    expect(response.body.data?.token).toBe(undefined);
  });

  it("Should flag for otp if not provided (2FA)", async () => {
    await Settings.create({
      userId: user._id,
      twoFactorAuth: { enabled: true } 
    });
    const response = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "password");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.twoFactorAuthRequired).toBe(true);
    expect(response.body.data).not.toHaveProperty("token");
  });

  it("should login a user with valid otp (2FA)", async () => {
    await Settings.create({
      userId: user._id,
      twoFactorAuth: { enabled: true } 
    });
    const otp = await user.sendOtp();
    const response = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "password")
      .field("otp", otp);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });

  it("shouldn't login a user with invalid OTP (2FA)", async () => {
    await Settings.create({
      userId: user._id,
      twoFactorAuth: { enabled: true } 
    });
    const response = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "password")
      .field("otp", 91827203);

    expect(response.statusCode).toBe(401);
    expect(response.body.data).not.toHaveProperty("token");
  });

  it("should prevent Brute Force login", async () => {
    Cache.mock();
    const attemptCacheKey = "LOGIN-FAILED-ATTEMPTS_" + user.email;
    const response1 = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "wrong-password");
    Cache.assertStored(attemptCacheKey, 1, 60 * 60);
    const response2 = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "wrong-password");
    Cache.assertStored(attemptCacheKey, 2, 60 * 60);
    const response3 = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "wrong-password");
    Cache.assertStored(attemptCacheKey, 3, 60 * 60);
    const response4 = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "wrong-password");
    Cache.assertStored(attemptCacheKey, 4, 60 * 60);
    const response5 = await request
      .post("/api/v1/auth/login")
      .field("email", user.email)
      .field("password", "wrong-password");

    expect(response1.statusCode).toBe(401);
    expect(response2.statusCode).toBe(401);
    expect(response3.statusCode).toBe(401);
    expect(response4.statusCode).toBe(401);
    expect(response5.statusCode).toBe(429);
  });

  it("should verify email", async () => {
    let unverifiedUser = await User.factory().create({ verified: false });
    const verificationLink = await unverifiedUser.sendVerificationEmail();
    const response = await fetch(verificationLink);
    unverifiedUser = await User.findById(unverifiedUser._id);
    expect(response.status).toBe(200);
    expect(unverifiedUser.verified).toBe(true);
  });

  it("shouldn't verify email without signature", async () => {
    let unverifiedUser = await User.factory().create({ verified: false });
    const verificationLink = URL.route("email.verify", {
      id: unverifiedUser._id,
    });
    const response = await fetch(verificationLink);
    unverifiedUser = await User.findById(unverifiedUser._id);
    expect(response.status).toBe(401);
    expect(unverifiedUser.verified).toBe(false);
  });

  it("should resend verification email", async () => {
    let unverifiedUser = await User.factory().create({ verified: false });
    const response = await request
      .post("/api/v1/auth/verify/resend")
      .field("email", unverifiedUser.email);

    expect(response.statusCode).toBe(200);
    Mail.assertCount(1);
    Mail.assertSentTo(unverifiedUser.email, "VerificationMail");
  });

  it("should get profile", async () => {
    const response = await request
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    delete user.password;
    expect(response.body.data).toEqualDocument(user);
  });

  it("should update profile", async () => {
    Storage.mock();
    const response = await request
      .put("/api/v1/auth/profile")
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
      .put("/api/v1/auth/profile")
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
      .put("/api/v1/auth/profile")
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
      .put("/api/v1/auth/profile")
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
      .put("/api/v1/auth/profile")
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

  it("should change password", async () => {
    const passwords = {
      old: "password",
      new: "new-password",
    };
    const response = await request
      .put("/api/v1/auth/password/change")
      .set("Authorization", `Bearer ${token}`)
      .field("oldPassword", passwords.old)
      .field("password", passwords.new);
    user = await User.findById(user._id);
    const passwordMatch = await bcrypt.compare(passwords.new, user.password);
    expect(response.statusCode).toBe(200);
    expect(passwordMatch).toBe(true);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "PasswordChangedMail");
  });

  it("shouldn't change password, if old and new passwords are same", async () => {
    const response = await request
      .put("/api/v1/auth/password/change")
      .set("Authorization", `Bearer ${token}`)
      .field("oldPassword", "password")
      .field("password", "password");
    expect(response.statusCode).toBe(400);
    Mail.assertNothingSent();
  });

  it("shouldn't change password of OAuth account", async () => {
    const OAuthUser = await User.factory().create({ password: null });
    const response = await request
      .put("/api/v1/auth/password/change")
      .set("Authorization", `Bearer ${OAuthUser.createToken()}`)
      .field("oldPassword", "password")
      .field("password", "new-password");
    expect(response.statusCode).toBe(400);
    Mail.assertNothingSent();
  });

  it("forgoting password should send reset email", async () => {
    const response = await request
      .post("/api/v1/auth/password/forgot")
      .field("email", user.email);
    expect(response.statusCode).toBe(200);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "ForgotPasswordMail");
  });

  it("forgoting password shouldn't send reset email of OAuth account", async () => {
    const OAuthUser = await User.factory().create({ password: null });
    const response = await request
      .post("/api/v1/auth/password/forgot")
      .field("email", OAuthUser.email);
    expect(response.statusCode).toBe(400);
    Mail.assertNothingSent();
  });

  it("should reset password", async () => {
    const resetToken = await user.sendResetPasswordEmail();
    Mail.mock();
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
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "PasswordChangedMail");
  });

  it("shouldn't reset password with invalid token", async () => {
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
    Mail.assertNothingSent();
  });

  it("Should update phone number", async () => {
    const newNumber = "+14155552671";
    const response = await request
      .put("/api/v1/auth/change-phone-number")
      .set("Authorization", `Bearer ${token}`)
      .field("phoneNumber", newNumber);
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.phoneNumber).toBe(newNumber);
  });

  it("Should send otp", async () => {
    await Settings.create({
      userId: user._id,
      twoFactorAuth: { enabled: true } 
    });
    const response = await request.post(
      "/api/v1/auth/send-otp/" + user._id.toString()
    );

    const otp = await OTP.findOne({ userId: user._id });
    expect(response.statusCode).toBe(200);
    expect(otp).not.toBeNull();
  });

  it("Shouldn't send otp if 2fa is disabled", async () => {
    await Settings.create({ userId: user._id });
    const response = await request.post(
      "/api/v1/auth/send-otp/" + user._id.toString()
    );
    expect(response.statusCode).toBe(200);
    const otp = await OTP.findOne({ userId: user._id });
    expect(response.statusCode).toBe(200);
    expect(otp).toBeNull();
  });
});
