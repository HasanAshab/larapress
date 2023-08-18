const app = require("main/app").default;
const server = app.listen(8000);
const request = require("supertest")(server);
const DB = require("illuminate/utils/DB").default;
const URL = require("illuminate/utils/URL").default;
const Attachment = require("app/models/Attachment").default;

describe("File", () => {
  beforeAll(async () => {
    await DB.connect();
  })
  
  afterAll(() => {
    server.close();
  })
  
  it("should respond with a file", async () => {
    const attachment = await Attachment.factory().create();
    const url = await URL.signedRoute("file.serve", {id: attachment._id});
    const response = await fetch(url)
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });
  
  it("shouldn't respond with a file without signature", async () => {
    const attachment = await Attachment.factory().create();
    const url = URL.route("file.serve", {id: attachment._id});
    const response = await fetch(url)
    expect(response.status).toBe(401);
  });
  
  it("shouldn't respond with a file, if signature is invalid", async () => {
    const attachment = await Attachment.factory().create();
    const url = URL.route("file.serve", {id: attachment._id});
    const response = await fetch(url + "?sign=foo")
    expect(response.status).toBe(401);
  });
});
