const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const User = require("app/models/User").default;
const Category = require("app/models/Category").default;
const Storage = require("illuminate/utils/Storage").default;

describe("Category", () => {
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
  
  it("Should create category", async () => {
    Storage.mock();
    const response = await request
      .post("/api/v1/admin/categories")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "foo bar")
      .field("slug", "foo-bar")
      .attach("icon", fakeFile("image.png"));
  
    expect(response.statusCode).toBe(201);
    expect(await Category.findOne({ slug: "foo-bar" })).not.toBeNull();
    Storage.assertStoredCount(1);
    Storage.assertStored("image.png");
  });
  
  it("Should create category without icon", async () => {
    Storage.mock();
    const response = await request
      .post("/api/v1/admin/categories")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "foo bar")
      .field("slug", "foo-bar");

    expect(response.statusCode).toBe(201);
    expect(await Category.findOne({ slug: "foo-bar" })).not.toBeNull();
    Storage.assertNothingStored();
  });

  it("Shouldn't create category with existing slug", async () => {
    const category = await Category.factory().create();
    const response = await request
      .post("/api/v1/admin/categories")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "foo bar")
      .field("slug", category.slug)

    expect(response.statusCode).toBe(400);
  });

  it("Should get category by id", async () => {
    const category = await Category.factory().create();
    const response = await request
      .get("/api/v1/admin/categories/" + category._id)
      .set("Authorization", `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqualDocument(category);
  });
  
  it("Should update category", async () => {
    let category = await Category.factory().create();
    const response = await request
      .put("/api/v1/admin/categories/" + category._id)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "foo bar")
      .field("slug", "foo-bar")
    
    category = await Category.findById(category._id);
    expect(response.statusCode).toBe(200);
    expect(category.name).toBe("foo bar");
    expect(category.slug).toBe("foo-bar");
  });
  
  it("Should update category with icon", async () => {
    let category = await Category.factory().create();
    Storage.mock();
    const response = await request
      .put("/api/v1/admin/categories/" + category._id)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "foo bar")
      .field("slug", "foo-bar")
      .attach("icon", fakeFile("image.png"));
    
    category = await Category.findById(category._id);
    expect(response.statusCode).toBe(200);
    expect(category.name).toBe("foo bar");
    expect(category.slug).toBe("foo-bar");
    Storage.assertStoredCount(1);
    Storage.assertStored("image.png");
  });
  
  it("Shouldn't update category with existing slug", async () => {
    let category = await Category.factory().create();
    let anotherCategory = await Category.factory().create();
    const response = await request
      .put("/api/v1/admin/categories/" + category._id)
      .set("Authorization", `Bearer ${token}`)
      .field("name", "foo bar")
      .field("slug", anotherCategory.slug);
    
    expect(response.statusCode).toBe(400);
  });

  it("Should delete category", async () => {
    const category = await Category.factory().create();
    const response = await request
      .delete("/api/v1/admin/categories/" + category._id)
      .set("Authorization", `Bearer ${token}`);
      
    expect(response.statusCode).toBe(204);
    expect(await Category.findById(category._id)).toBeNull();
  });
  
});
