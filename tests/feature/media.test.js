const app = require("main/app").default;
const request = require("supertest")(app.listen(8000));
const DB = require("illuminate/utils/DB").default;
const URL = require("illuminate/utils/URL").default;
const Media = require("app/models/Media").default;

describe("Media", () => {
  it("should responds with a file", async () => {
    const media = await Media.factory().create();
    const url = URL.signedRoute("file.serve", {id: media._id});
    const response = await fetch(url)
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });
});
