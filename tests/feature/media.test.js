const app = require("main/app").default;
const request = require("supertest")(app);
const DB = require("illuminate/utils/DB").default;
const URL = require("illuminate/utils/URL").default;
const Media = require("app/models/Media").default;

describe("Media", () => {
  it("should responds with a file", async () => {
    const media = await Media.factory().create();
    const url = URL.route("file.serve", {id: media._id});
    const subUrl = url.replace(URL.resolve(), "/");
    const sign = URL.createSignature(subUrl + 0);
   
    const response = await request
      .get(subUrl)
      .query({sign})
      .set("Accept", "application/octet-stream");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("image/png");
    expect(Buffer.isBuffer(response.body)).toBe(true);
  });
});
