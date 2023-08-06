const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const User = require("app/models/User").default;
const { env, toCamelCase } = require("helpers");

describe("Settings", () => {
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
  
  it("App settings shouldn't accessable by general users", async () => {
    const user = await User.factory().create();
    const userToken = user.createToken();
    const responses = [
      request.get("/api/v1/settings/app"),
      request.put("/api/v1/settings/app"),
    ];
    const isNotAccessable = responses.every(async (response) => {
      return await response.set("Authorization", `Bearer ${userToken}`).statusCode === 401;
    });
    expect(isNotAccessable).toBe(true);
  });
  
  it("Admin should get app settings", async () => {
    const envData = env();
    const camelCaseData = {};
    for (const key in envData) {
      const camelCaseKey = toCamelCase(key.toLowerCase())
      camelCaseData[camelCaseKey] = envData[key];
    }
    
    const response = await request
      .get("/api/v1/settings/app")
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(camelCaseData);
  });

  it("Admin should update app settings", async () => {
    const response = await request
      .put("/api/v1/settings/app")
      .set("Authorization", `Bearer ${token}`)
      .field("appName", "FooBar")

    expect(response.statusCode).toBe(200);
    expect(env().APP_NAME).toBe("FooBar");
    env({APP_NAME: "Samer"});
  });
  
  it("Should get settings", async () => {
    const response = await request
      .put("/api/v1/settings")
      .set("Authorization", `Bearer ${token}`)
      .field("appName", "FooBar")

    expect(response.statusCode).toBe(200);
  });
  
  it("Should enable Two Factor Authorization", async () => {
    const response = await request
      .put("/api/v1/settings/enable-2fa")
      .set("Authorization", `Bearer ${token}`)
      .field("appName", "FooBar")

    expect(response.statusCode).toBe(200);
  });
  
  
});
