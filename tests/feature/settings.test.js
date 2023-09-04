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
  
  beforeEach(async () => {
    await DB.reset();
    user = await User.factory().create();
    token = user.createToken();
  });
  
  it("App settings shouldn't accessable by general users", async () => {
    const responses = [
      request.get("/v1/settings/app"),
      request.put("/v1/settings/app"),
    ];
    const isNotAccessable = responses.every(async (response) => {
      return await response.set("Authorization", `Bearer ${token}`).statusCode === 401;
    });
    expect(isNotAccessable).toBe(true);
  });
  
  it("Admin should get app settings", async () => {
    const admin = await User.factory().create({ role: "admin" });
    const response = await request
      .get("/v1/settings/app")
      .set("Authorization", `Bearer ${admin.createToken()}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(config);
  });

  it("Admin should update app settings", async () => {
    const admin = await User.factory().create({ role: "admin" });
    const response = await request
      .put("/v1/settings/app")
      .set("Authorization", `Bearer ${admin.createToken()}`)
      .send({
        app: {
          name: "FooBar"
        }
      });

    expect(response.statusCode).toBe(200);
    expect(config.get("app.name")).toBe("FooBar");
    config.app.name = "Samer";
  });
  
  it("Should get settings", async () => {
    const response = await request
      .get("/v1/settings")
      .set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(await user.settings);
  });
  
  it("Should enable Two Factor Authorization", async () => {
    const response = await request
      .post("/v1/settings/enable-2fa")
      .set("Authorization", `Bearer ${token}`)
      .field("method", "sms")
      .field("otp", await user.sendOtp());
    
    const settings = await user.settings;
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
      .put("/v1/settings/notification")
      .set("Authorization", `Bearer ${token}`)
      .send(data)
    
    const settings = await user.settings;
    expect(response.statusCode).toBe(200);
    for(key1 in data){
      for(key2 in data[key1]){
        expect(data[key1][key2]).toBe(settings.notification[key1][key2]);
      }
    }
  });
  
});
