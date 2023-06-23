const FileValidator = require("illuminate/utils/FileValidator").default;

describe("fileValidator", () => {
  const files = {
    file: {
      name: "dummy.jpg",
      data: Buffer.from("dummy file content"),
      size: 100000,
      encoding: "utf-8",
      tempFilePath: "/path/to/temp/file",
      truncated: false,
      mimetype: "image/jpeg",
      md5: "e99a18c428cb38d5f260853678922e03",
      mv: async (path) => true,
    },
  };
  
  it("[max] validator works", async () => {
    const ruleSchema = FileValidator.fields({
      file: new FileValidator().max(900),
    });
    //expect(ruleSchema.validate(files)).toThrow(Error);
    console.log(ruleSchema.validate(files));
  });
});
