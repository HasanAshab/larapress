const DB = require("DB").default;
const URL = require("URL").default;
const Attachment = require("~/app/models/Attachment").default;

describe("File", () => {
  let attachment;

  beforeAll(async () => {
    await DB.connect();
    attachment = await Attachment.factory().create();
  })

  it("should respond with a file", async () => {
    const url = await URL.signedRoute("file.serve", {id: attachment._id});
    const response = await fetch(url)
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
  });
  
  it("shouldn't respond with a file without signature", async () => {
    const url = URL.route("file.serve", {id: attachment._id});
    const response = await fetch(url)
    expect(response.status).toBe(401);
    expect(response.headers.get("content-type")).not.toBe("image/png");
  });
  
  it("shouldn't respond with a file, if signature is invalid", async () => {
    const url = URL.route("file.serve", {id: attachment._id});
    const response = await fetch(url + "?sign=foo")
    expect(response.status).toBe(401);
    expect(response.headers.get("content-type")).not.toBe("image/png");
  });
});
