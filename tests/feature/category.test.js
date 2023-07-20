const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const User = require("app/models/User").default;
const Category = require("app/models/Category").default;

describe("Category", () => {
  let admin;
  let token;
  
  beforeAll(async () => {
    await DB.connect();
  });
  
  beforeEach(async () => {
    await resetDatabase();
    admin = await User.factory().create({isAdmin: true});
    token = admin.createToken();
  });
  
  it("Shouldn't accessable by general users", async () => {
    const user = await User.factory().create();
    const userToken = user.createToken();
    const responses = [
      request.get("/api/v1/admin/categories"),
      request.post("/api/v1/admin/categories"),
      request.get("/api/v1/admin/categories/foo-user-id"),
      request.put("/api/v1/admin/categories/foo-user-id"),
      request.delete("/api/v1/admin/categories/foo-user-id")
    ]
    const isNotAccessable = responses.every(async (response) => {
      return await response.set("Authorization", `Bearer ${userToken}`).statusCode === 401;
    });
    expect(isNotAccessable).toBe(true);
  });
  
  it("Should get all categories", async () => {
    const categories = await Category.factory(3).create();
    const response = await request
      .get("/api/v1/admin/categories")
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(categories);
  });



});
