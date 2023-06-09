const Storage = require(base("illuminate/utils/Storage")).default;
const fs = require("fs");

describe("storage", () => {
  it("Should store file", async () => {
    const file = {
      name: "test.png",
      data: fs.readFileSync(fakeFile("image.png"))
    }
    const path = await Storage.putFile("public/uploads", file);
    const data = fs.readFileSync(path);
    expect(fs.existsSync(path)).toBe(true);
    expect(data).toStrictEqual(file.data);
    fs.unlinkSync(path)
  });
});