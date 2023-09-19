const DB = require("DB").default;
const User = require("~/app/models/User").default;
const Settings = require("~/app/models/Settings").default;
const config = require("config")

describe("Settings", () => {
  let user;
  let token;

  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async (config) => {
    await DB.reset(["User", "Notification"]);
    if(config.user !== false) {
      factory = User.factory().withRole(config.role ?? "novice");
      if(config.settings !== false)
        factory.hasSettings(config.mfa);
      
      if(config.phone)
        factory.withPhoneNumber();
      
      user = await factory.create();
      token = user.createToken();
    }
  });
  
  it("App settings shouldn't accessable by novice users", { settings: false }, async () => {
    const requests = [
      request.get("/settings/app"),
      request.put("/settings/app"),
    ];
    const responses = await Promise.all(
      requests.map((request) => request.actingAs(token))
    );
    const isNotAccessable = responses.every((response) => response.statusCode === 403);
    expect(isNotAccessable).toBe(true);
  });
  
  it("Admin should get app settings", { role: "admin", settings: false }, async () => {
    const response = await request.get("/settings/app").actingAs(token);
    console.log(response.body)
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(config);
  });

  it("Admin should update app settings", { role: "admin", settings: false }, async () => {
    const response = await request.put("/settings/app").actingAs(token).send({
      app: { name: "FooBar" }
    });
    expect(response.statusCode).toBe(200);
    expect(config.get("app.name")).toBe("FooBar");
    config.app.name = "Samer";
  });
  
  it("Should get settings", async () => {
    const response = await request.get("/settings").actingAs(token);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(await user.settings);
  });
  
  it("Should enable Two Factor Authorization", { phone: true }, async () => {
    const response = await request.post("/settings/setup-2fa").actingAs(token).send({ enabled: true });
    const settings = await user.settings;
    expect(response.statusCode).toBe(200);
    expect(settings.twoFactorAuth.enabled).toBe(true);
  });
  
  it("Should disable Two Factor Authorization", { mfa: true, phone: true }, async () => {
    const response = await request.post("/settings/setup-2fa").actingAs(token).send({ enabled: false });
    const settings = await user.settings;
    expect(response.statusCode).toBe(200);
    expect(settings.twoFactorAuth.enabled).toBe(false);
  });
  
  it("Two Factor Authorization should flag for phone number if not setted", async () => {
    const response = await request.post("/settings/setup-2fa").actingAs(token).send({ enabled: true });
    const settings = await user.settings;
    expect(response.statusCode).toBe(400);
    expect(response.body.data.phoneNumberRequired).toBe(true);
    expect(settings.twoFactorAuth.enabled).toBe(false);
  });
  
  it("Two Factor Authorization app method sends OTP Auth URL", async () => {
    const response = await request.post("/settings/setup-2fa").actingAs(token).send({ enabled: true, method: "app" });
    const settings = await user.settings;
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty("otpauthURL");
    expect(settings.twoFactorAuth.enabled).toBe(true);
  });

  
  it("Should change Two Factor Authorization method", { mfa: true, phone: true }, async () => {
    const response = await request.post("/settings/setup-2fa").actingAs(token).send({ method: "call" });
    const settings = await user.settings;
    expect(response.statusCode).toBe(200);
    expect(settings.twoFactorAuth.method).toBe("call");
  });


  it("Should update notification settings", async () => {
    const data = {
      announcement: {
        email: false
      },
      feature: {
        email: false,
        site: false
      },
      others: {
        site: false
      }
    };
    const response = await request.put("/settings/notification").actingAs(token).send(data);
    const settings = await user.settings;
    expect(response.statusCode).toBe(200);
    for(key1 in data){
      for(key2 in data[key1]){
        expect(data[key1][key2]).toBe(settings.notification[key1][key2]);
      }
    }
  });
  
});
