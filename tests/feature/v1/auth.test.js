const DB = require("DB").default;
const URL = require("URL").default;
const Cache = require("Cache").default;
const Storage = require("Storage").default;
const Mail = require("Mail").default;
const User = require("~/app/models/User").default;
const OTP = require("~/app/models/OTP").default;
const { OAuth2Client } = require("google-auth-library");

describe("Auth", () => {
  let user;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });

  beforeEach(async (config) => {
    await DB.reset();
    Mail.mock();
    if(config.user !== false) {
      const userData = {
        verified: config.verified ?? true,
        password: config.oauth && null
      }
      user = await User.factory({ mfa: config.mfa, events: config.events }).create(userData);
      token = user.createToken();
    }
  })

  it("should register a user", { user: false }, async () => {
    const data = {
      username: "foobar123",
      email: "foo@gmail.com",
      password: "Password@1234",
      logo: fakeFile("image.png")
    };
    Storage.mock();
    const response = await request.post("/auth/register").multipart(data);
    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("token");
    expect(await User.findOne({ email: data.email })).not.toBeNull();
    Storage.assertStoredCount(1);
    Storage.assertStored("image.png");
  });

  it("should register a user without logo", { user: false }, async () => {
    const data = {
      username: "foobar123",
      email: "foo@gmail.com",
      password: "Password@1234"
    };
    Storage.mock();
    const response = await request.post("/auth/register").multipart(data)

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty("token");
    expect(await User.findOne({ email: data.email })).not.toBeNull();
    Storage.assertNothingStored();
  });

  it("shouldn't register with existing email", async () => {
    const response = await request.post("/auth/register").multipart({
      username: "foo",
      email: user.email,
      password: "Password@1234"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.data).not.toHaveProperty("token");
  });

  it("shouldn't register with existing username", async () => {
    const response = await request.post("/auth/register").multipart({
      username: user.username,
      email: "foo@test.com",
      password: "Password@1234"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.data).not.toHaveProperty("token");
  });

  it("should login a user", { events: true }, async () => {
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "password"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });

  it("shouldn't login with wrong password", async () => {
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "wrong-pass"
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.data?.token).toBe(undefined);
  });
    
  it("shouldn't login manually in OAuth account", { oauth: true }, async () => {
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "password"
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.data?.token).toBe(undefined);
  });

  it("Login should flag for otp if not provided in (2FA)", { mfa: true, events: true }, async () => {
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "password"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.twoFactorAuthRequired).toBe(true);
    expect(response.body.data).not.toHaveProperty("token");
  });

  it("should login a user with valid otp (2FA)", { mfa: true, events: true }, async () => {
    const otp = await user.sendOtp();
    const response = await request.post("/auth/login").send({
      otp,
      email: user.email,
      password: "password"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });

  it("shouldn't login a user with invalid OTP (2FA)", { mfa: true, events: true }, async () => {
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "password",
      otp: 999999
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.data).not.toHaveProperty("token");
  });
  
  it("Should send otp", { mfa: true, events: true }, async () => {
    const response = await request.post("/auth/send-otp").send({
      userId: user._id.toString(),
      method: "sms"
    });
    const otp = await OTP.findOne({ userId: user._id });
    expect(response.statusCode).toBe(200);
    expect(otp).not.toBeNull();
  });
  
  it("Shouldn't send otp if 2fa is disabled", { events: true }, async () => {
    const response = await request.post("/auth/send-otp").send({
      userId: user._id.toString(),
      method: "sms"
    });
    expect(response.statusCode).toBe(403);
    const otp = await OTP.findOne({ userId: user._id });
    expect(otp).toBeNull();
  });

  it("should prevent Brute Force login", async () => {
    Cache.mock();
    const attemptCacheKey = "LOGIN-FAILED-ATTEMPTS_" + user.email;
    const response1 = await request.post("/auth/login").send({
      email: user.email,
      password: "wrong-pass"
    });
    Cache.assertStored(attemptCacheKey, 1, 60 * 60);
    const response2 = await request.post("/auth/login").send({
      email: user.email,
      password: "wrong-pass"
    });
    Cache.assertStored(attemptCacheKey, 2, 60 * 60);
    const response3 = await request.post("/auth/login").send({
      email: user.email,
      password: "wrong-pass"
    });
    Cache.assertStored(attemptCacheKey, 3, 60 * 60);
    const response4 = await request.post("/auth/login").send({
      email: user.email,
      password: "wrong-pass"
    });
    Cache.assertStored(attemptCacheKey, 4, 60 * 60);
    const response5 = await request.post("/auth/login").send({
      email: user.email,
      password: "wrong-pass"
    });
    
    expect(response1.statusCode).toBe(401);
    expect(response2.statusCode).toBe(401);
    expect(response3.statusCode).toBe(401);
    expect(response4.statusCode).toBe(401);
    expect(response5.statusCode).toBe(429);
  });

  it("should verify email", { verified: false }, async () => {
    const verificationLink = await user.sendVerificationEmail();
    const response = await fetch(verificationLink);
    user = await User.findById(user._id);
    expect(response.status).toBe(200);
    expect(user.verified).toBe(true);
  });

  it("shouldn't verify email without signature", { verified: false }, async () => {
    const verificationLink = URL.route("email.verify", {
      id: user._id,
    });
    const response = await fetch(verificationLink);
    user = await User.findById(user._id);
    expect(response.status).toBe(401);
    expect(user.verified).toBe(false);
  });

  it("should resend verification email", { verified: false }, async () => {
    const response = await request.post("/auth/verify/resend").send({
      email: user.email
    });

    expect(response.statusCode).toBe(200);
    await sleep(3000);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "VerificationMail");
  });

  it("should change password", async () => {
    const data = {
      oldPassword: "password",
      password: "Password@1234",
    };
    const response = await request.put("/auth/password/change").actingAs(token).send(data);
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(await user.attempt(data.password)).toBe(true);
  });

  it("shouldn't change password of OAuth account", { oauth: true }, async () => {
    const response = await request.put("/auth/password/change").actingAs(token).send({
      oldPassword: "password",
      password: "Password@1234"
    });
    expect(response.statusCode).toBe(400);
    Mail.assertNothingSent();
  });

  it("Should send reset email", async () => {
    const response = await request.post("/auth/password/reset/send-email").send({
      email: user.email
    });
    expect(response.statusCode).toBe(200);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "ForgotPasswordMail");
  });

  it("Shouldn't send reset email of OAuth account", { oauth: true }, async () => {
    const response = await request.post("/auth/password/reset/send-email").send({
      email: user.email
    });
    expect(response.statusCode).toBe(400);
    Mail.assertNothingSent();
  });

  it("should reset password", async () => {
    const token = await user.sendResetPasswordEmail();
    const password = "Password@1234";
    const response = await request.put("/auth/password/reset").send({
      id: user._id.toString(),
      password,
      token
    });

    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(await user.attempt(password)).toBe(true);
  });

  it("shouldn't reset password with invalid token", async () => {
    const password = "Password@1234";
    const response = await request.put("/auth/password/reset").send({
      id: user._id.toString(),
      token: "foo",
      password
    });
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(401);
    expect(await user.attempt(password)).toBe(false);
    Mail.assertNothingSent();
  });

  it("Should update phone number", async () => {
    const phoneNumber = "+14155552671";
    const response = await request.put("/auth/change-phone-number").actingAs(token).send({ phoneNumber });
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.phoneNumber).toBe(phoneNumber);
  });
});
