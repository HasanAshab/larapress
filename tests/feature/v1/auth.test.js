const DB = require("DB").default;
const URL = require("URL").default;
const Cache = require("Cache").default;
const Storage = require("Storage").default;
const Mail = require("Mail").default;
const User = require("~/app/models/User").default;
const OTP = require("~/app/models/OTP").default;
const AuthService = require("~/app/services/AuthService").default;
const { OAuth2Client } = require("google-auth-library");

describe("Auth", () => {
  let user;
  let token;
  let authService = new AuthService();
  beforeAll(async () => {
    await DB.connect();
  });

  beforeEach(async config => {
    await DB.reset(["User", "OTP"]);
    Mail.mock();
    if(config.user) {
      user = await User.factory().create();
      token = user.createToken();
    }
  });

  it("should register a user", async () => {
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

  it("should register a user without logo", async () => {
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

  it("shouldn't register with existing email", { user: true }, async () => {
    const response = await request.post("/auth/register").multipart({
      username: "foo",
      email: user.email,
      password: "Password@1234"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).not.toHaveProperty("data");
  });

  it("shouldn't register with existing username", { user: true }, async () => {
    const response = await request.post("/auth/register").multipart({
      username: user.username,
      email: "foo@test.com",
      password: "Password@1234"
    });
    expect(response.statusCode).toBe(400);
    expect(response.body).not.toHaveProperty("data");
  });

  it("should login a user", async () => {
    const user = await User.factory().hasSettings().create();
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "password"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });

  it("shouldn't login with wrong password", { user: true }, async () => {
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "wrong-pass"
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.data?.token).toBe(undefined);
  });
    
  it("shouldn't login manually in OAuth account", async () => {
    const user = await User.factory().oauth().create();
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "password"
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.data?.token).toBe(undefined);
  });

  it("Login should flag for otp if not provided in (2FA)", async () => {
    const user = await User.factory().withPhoneNumber().hasSettings(true).create();
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "password"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data.twoFactorAuthRequired).toBe(true);
    expect(response.body.data).not.toHaveProperty("token");
  });

  it("should login a user with valid otp (2FA)", async () => {
    const user = await User.factory().withPhoneNumber().hasSettings(true).create();
    const { code: otp } = await OTP.create({ userId: user._id });
    const response = await request.post("/auth/login").send({
      otp,
      email: user.email,
      password: "password"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });

  it("shouldn't login a user with invalid OTP (2FA)", async () => {
    const user = await User.factory().withPhoneNumber().hasSettings(true).create();
    const response = await request.post("/auth/login").send({
      email: user.email,
      password: "password",
      otp: 999999
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).not.toHaveProperty("body");
  });
  
  it("should prevent Brute Force login", { user: true }, async () => {
    const payload = {
      email: user.email,
      password: "wrong-pass"
    };
    Cache.mock();
    const responses = [];
    for (let i = 0; i < 5; i++) {
      const response = await request.post("/auth/login").send(payload);
      responses.push(response);
    }
    expect(responses[0].statusCode).toBe(401);
    expect(responses[1].statusCode).toBe(401);
    expect(responses[2].statusCode).toBe(401);
    expect(responses[3].statusCode).toBe(401);
    expect(responses[4].statusCode).toBe(429);
  });
  
  it("should login a user with valid recovery code", async () => {
    const user = await User.factory().withPhoneNumber().hasSettings(true).create();
    const [ code ] = await authService.generateRecoveryCodes(user, 1);
    const response = await request.post("/auth/login/recovery-code").send({
      email: user.email,
      code
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("token");
  });
  
  it("shouldn't login a user with same recovery code multiple times", async () => {
    const user = await User.factory().withPhoneNumber().hasSettings(true).create();
    const [ code ] = await authService.generateRecoveryCodes(user, 1);
    const response1 = await request.post("/auth/login/recovery-code").send({ email: user.email, code });
    const response2 = await request.post("/auth/login/recovery-code").send({ email: user.email, code });
    expect(response1.statusCode).toBe(200);
    expect(response2.statusCode).toBe(401);
    expect(response1.body.data).toHaveProperty("token");
    expect(response2.body).not.toHaveProperty("data");
  });
  
  it("shouldn't login a user with invalid recovery code", async () => {
    const user = await User.factory().withPhoneNumber().hasSettings(true).create();
    await authService.generateRecoveryCodes(user, 1);
    const response = await request.post("/auth/login/recovery-code").send({
      email: user.email,
      code: "foo-bar"
    });
    console.log(response.body)
    expect(response.statusCode).toBe(401);
    expect(response.body).not.toHaveProperty("data");
  });
  
  it.only("should generate new recovery codes", { user: true }, async () => {
    const user = await User.factory().withPhoneNumber().hasSettings(true).create();
    const oldCodes = await authService.generateRecoveryCodes(user);
    const response = await request.post("/auth/generate-recovery-codes").actingAs(user.createToken());
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(10);
    expect(response.body.data).not.toEqual(oldCodes);
  });

  it("Should send otp", async () => {
    const user = await User.factory().withPhoneNumber().hasSettings(true).create();
    const response = await request.post("/auth/send-otp/" + user._id);
    await sleep(2000)
    const otp = await OTP.findOne({ userId: user._id });
    
    expect(response.statusCode).toBe(200);
    expect(otp).not.toBeNull();
  });
  
  it("should verify email", async () => {
    let user = await User.factory().unverified().create();
    const verificationLink = await authService.sendVerificationLink(user);
    const response = await fetch(verificationLink);
    user = await User.findById(user._id);
    expect(response.status).toBe(200);
    expect(user.verified).toBe(true);
  });

  it("shouldn't verify email without signature", async () => {
    let user = await User.factory().unverified().create();
    const verificationLink = URL.route("email.verify", {
      id: user._id,
    });
    const response = await fetch(verificationLink);
    user = await User.findById(user._id);
    expect(response.status).toBe(401);
    expect(user.verified).toBe(false);
  });

  it("should resend verification email", async () => {
    const user = await User.factory().unverified().create();
    const response = await request.post("/auth/verify/resend").send({
      email: user.email
    });

    expect(response.statusCode).toBe(200);
    await sleep(2000);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "VerificationMail");
  });

  it.only("should change password", { user: true }, async () => {
    const data = {
      oldPassword: "password",
      newPassword: "Password@1234",
    };
    const response = await request.put("/auth/password/change").actingAs(token).send(data);
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(await user.attempt(data.newPassword)).toBe(true);
  });

  it.only("shouldn't change password of OAuth account", async () => {
    const user = await User.factory().oauth().create();
    const response = await request.put("/auth/password/change").actingAs(user.createToken()).send({
      oldPassword: "password",
      newPassword: "Password@1234"
    });
    expect(response.statusCode).toBe(403);
    Mail.assertNothingSent();
  });

  it("Should send reset email", { user: true }, async () => {
    const response = await request.post("/auth/password/reset/send-email").send({ email: user.email });
    expect(response.statusCode).toBe(200);
    await sleep(2000);
    Mail.assertCount(1);
    Mail.assertSentTo(user.email, "ForgotPasswordMail");
  });

  it("Shouldn't send reset email of OAuth account", async () => {
    const user = await User.factory().oauth().create();
    const response = await request.post("/auth/password/reset/send-email").send({
      email: user.email
    });
    await sleep(3000);
    Mail.assertNothingSent();
  });

  it("should reset password", { user: true }, async () => {
    const token = await authService.sendResetPasswordLink(user);
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

  it("shouldn't reset password with invalid token", { user: true }, async () => {
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

  it("Should update phone number with valid otp", async () => {
    let user = await User.factory().hasSettings().create();
    const phoneNumber = "+14155552671";
    const { code: otp } = await OTP.create({ userId: user._id });
    const response = await request.put("/auth/change-phone-number").actingAs(user.createToken()).send({ phoneNumber, otp });
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.phoneNumber).toBe(phoneNumber);
  });
  
  it("Shouldn't update phone number with invalid otp", { user: true }, async () => {
    const phoneNumber = "+14155552671";
    const response = await request.put("/auth/change-phone-number").actingAs(token).send({ phoneNumber, otp: 123456 });
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(401);
    expect(user.phoneNumber).not.toBe(phoneNumber);
  });
  
  it("Update phone number should send otp if otp code not provided", { user: true }, async () => {
    const phoneNumber = "+14155552671";
    const response = await request.put("/auth/change-phone-number").actingAs(token).send({ phoneNumber });
    const otp = await OTP.findOne({ userId: user._id });
    user = await User.findById(user._id);
    expect(response.statusCode).toBe(200);
    expect(user.phoneNumber).not.toBe(phoneNumber);
    expect(otp).not.toBeNull();
  });
});
