import { UploadedFile } from "express-fileupload";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export default class LocalDriver {
  async putFile(disk: string, file: UploadedFile) {
    const name = `${Date.now()}_${file.name}`;
    const filePath = path.join("storage", disk, name);
    await fs.writeFile(filePath, file.data);
    return name;
  };

  static hashFileName(fileName: string) {
    const hash = crypto.createHash("sha256").update(fileName).digest("hex");
    const fileExt = path.extname(fileName);
    return `${Date.now()}_${hash}${fileExt}`;
  };
}