const app = require(base("main/app"));
const supertest = require("supertest");
const DB = require(base("illuminate/utils/DB"));
const request = supertest(app);
const Media = require(base("app/models/Media"));

//resetDatabase();

describe("Media", () => {
  it("should responds with a file", async () => {
    await DB.connect();
    const media = await Media.create({
      path: fakeFile("image.png"),
    });
    const response = await request
      .get(`/api/media/${media._id}`)
      .set("Accept", "application/octet-stream");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("image/png");
    expect(Buffer.isBuffer(response.body)).toBe(true);
  });
});
