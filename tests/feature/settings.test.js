const DB = require("DB").default;
const User = require("~/app/models/User").default;
const Settings = require("~/app/models/Settings").default;
const { env, toCamelCase } = require("helpers");

describe("Settings", () => {
  let user;
  let token;
  let settings;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await DB.reset();
    user = await User.factory().create();
    token = user.createToken();
    settings = await Settings.create({ userId: user._id });
  });
  
  it("App settings shouldn't accessable by general users", async () => {
    const responses = [
      request.get("/api/v1/settings/app"),
      request.put("/api/v1/settings/app"),
    ];
    const isNotAccessable = responses.every(async (response) => {
      return await response.set("Authorization", `Bearer ${token}`).statusCode === 401;
    });
    expect(isNotAccessable).toBe(true);
  });
  
  it("Admin should get app settings", async () => {
    const admin = await User.factory().create({ role: "admin" });
    const envData = env();
    const camelCaseData = {};
    for (const key in envData) {
      const camelCaseKey = toCamelCase(key.toLowerCase())
      camelCaseData[camelCaseKey] = envData[key];
    }
    
    const response = await request
      .get("/api/v1/settings/app")
      .set("Authorization", `Bearer ${admin.createToken()}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(camelCaseData);
  });

  it("Admin should update app settings", async () => {
    const admin = await User.factory().create({ role: "admin" });
    const response = await request
      .put("/api/v1/settings/app")
      .set("Authorization", `Bearer ${admin.createToken()}`)
      .field("appName", "FooBar")

    expect(response.statusCode).toBe(200);
    expect(env().APP_NAME).toBe("FooBar");
    env({APP_NAME: "Samer"});
  });
  
  it("Should get settings", async () => {
    const response = await request
      .get("/api/v1/settings")
      .set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(settings);
  });
  
  it("Should enable Two Factor Authorization", async () => {
    const response = await request
      .post("/api/v1/settings/enable-2fa")
      .set("Authorization", `Bearer ${token}`)
      .field("method", "sms")
      .field("otp", await user.sendOtp());
    
    settings = await user.settings;
    expect(response.statusCode).toBe(200);
    expect(settings.twoFactorAuth.enabled).toBe(true);
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

    const response = await request
      .put("/api/v1/settings/notification")
      .set("Authorization", `Bearer ${token}`)
      .send(data)
    
    settings = await user.settings;
    expect(response.statusCode).toBe(200);
    for(key1 in data){
      for(key2 in data[key1]){
        expect(data[key1][key2]).toBe(settings.notification[key1][key2]);
      }
    }
  });
  
});
