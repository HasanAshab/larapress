const FileValidator = require("FileValidator").default;

describe("FileValidator method works", () => {
  const files = {
    file1: {
      name: `dummy1.jpg`,
      data: Buffer.from("dummy file content"),
      size: 1000,
      encoding: "utf-8",
      mimetype: "image/jpeg",
    },
    file2: [
      {
        name: `dummy2.1.jpg`,
        data: Buffer.from("dummy file content"),
        size: 1000,
        encoding: "utf-8",
        mimetype: "image/jpeg",
      },
      {
        name: `dummy2.2.jpg`,
        data: Buffer.from("dummy file content"),
        size: 1500,
        encoding: "utf-8",
        mimetype: "image/png",
      },
      {
        name: `dummy3.jpg`,
        data: Buffer.from("dummy file content"),
        size: 2000,
        encoding: "utf-8",
        mimetype: "image/jpeg",
      },
    ],
  };

  it("~~required()~~", async () => {
    const schema1 = FileValidator.schema({
      file1: FileValidator.required(),
    });
    const schema2 = FileValidator.schema({
      absentFile: FileValidator.required(),
    });

    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).not.toBeNull();
  });

  it("~~optional()~~", async () => {
    const schema1 = FileValidator.schema({
      file1: FileValidator.optional(),
    });
    const schema2 = FileValidator.schema({
      absentFile: FileValidator.optional(),
    });
    const schema3 = FileValidator.schema({
      file1: FileValidator.optional().max(100),
    });
    const schema4 = FileValidator.schema({
      absentFile: FileValidator.optional().max(100),
    });

    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).toBeNull();
    expect(schema3.validate(files)).not.toBeNull();
    expect(schema4.validate(files)).toBeNull();
  });

  it("~~max()~~", async () => {
    const schema1 = FileValidator.schema({
      file1: FileValidator.required().max(1000),
    });
    const schema2 = FileValidator.schema({
      file1: FileValidator.required().max(900),
    });
    const schema3 = FileValidator.schema({
      file2: FileValidator.required().max(1500),
    });

    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).not.toBeNull();
    expect(schema3.validate(files)).not.toBeNull();
  });

  it("~~min()~~", async () => {
    const schema1 = FileValidator.schema({
      file1: FileValidator.required().max(1000),
    });
    const schema2 = FileValidator.schema({
      file1: FileValidator.required().max(900),
    });
    const schema3 = FileValidator.schema({
      file2: FileValidator.required().min(2000),
    });

    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).not.toBeNull();
    expect(schema3.validate(files)).not.toBeNull();
  });

  it("~~parts()~~", async () => {
    const schema1 = FileValidator.schema({
      file2: FileValidator.required().parts(3),
    });
    const schema2 = FileValidator.schema({
      file2: FileValidator.required().parts(1),
    });

    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).not.toBeNull();
  });

  it("~~maxParts()~~", async () => {
    const schema1 = FileValidator.schema({
      file2: FileValidator.required().maxParts(3),
    });
    const schema2 = FileValidator.schema({
      file2: FileValidator.required().maxParts(1),
    });

    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).not.toBeNull();
  });

  it("~~minParts()~~", async () => {
    const schema1 = FileValidator.schema({
      file2: FileValidator.required().minParts(2),
    });
    const schema2 = FileValidator.schema({
      file2: FileValidator.required().minParts(4),
    });

    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).not.toBeNull();
  });
  
  it("~~mimetypes()~~", async () => {
    const schema1 = FileValidator.schema({
      file1: FileValidator.required().mimetypes("image/jpeg"),
    });
    const schema2 = FileValidator.schema({
      file1: FileValidator.required().mimetypes("image/png"),
    });
    const schema3 = FileValidator.schema({
      file2: FileValidator.required().mimetypes("image/jpeg"),
    });
    const schema4 = FileValidator.schema({
      file2: FileValidator.required().mimetypes("image/jpeg", "image/png"),
    });

    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).not.toBeNull();
    expect(schema2.validate(files)).not.toBeNull();
    expect(schema4.validate(files)).toBeNull();
  });
  
  it("~~custom()~~", async () => {
    const schema1 = FileValidator.schema({
      file1: FileValidator.required().custom(file => {
        if(file.encoding !== "utf-8") return "custom-error";
      }),
    });
    
    const schema2 = FileValidator.schema({
      file1: FileValidator.required().custom(file => {
        if(file.encoding === "utf-8") return "custom-error";
      }),
    });
    
    const schema3 = FileValidator.schema({
      file2: FileValidator.required().custom(file => {
        if(!file.name.startsWith("dummy2")) return "custom-error";
      }),
    });
    
    
    expect(schema1.validate(files)).toBeNull();
    expect(schema2.validate(files)).toBe("custom-error");
    expect(schema3.validate(files)).toBe("custom-error");
  });
});
