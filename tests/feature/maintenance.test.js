const config = require("config");

describe("App", () => {
  beforeAll(() => {
    process.env.APP_STATE = "down";
  });
  
  it("shouldn't accessable when in maintenance mode", async () => {
    const response = await request.get("/");
    expect(response.statusCode).toBe(503);
  });
  
  it("shouldn't accessable with invalid bypass key when in maintenance mode", async () => {
    const response = await request.get("/").query({bypassKey: "foo-invalid-key"});
    expect(response.statusCode).toBe(503);
  });
  
  it("should accessable with valid bypass key when in maintenance mode", async () => {
    const response = await request.get("/").query({ bypassKey: config.get("app.key") });
    expect(response.statusCode).toBe(404);
  });
});
