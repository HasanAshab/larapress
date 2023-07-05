import { storage } from "helpers";
import { UploadedFile } from "express-fileupload";
import { promises as fs } from "fs";
import Mockable from "illuminate/utils/Storage/Mockable";
import { convertToMockable } from "illuminate/decorators/class";
import path from "path";
import crypto from "crypto";

@convertToMockable(Mockable)
export default class Storage {
  static async putFile(disk: string, file: UploadedFile) {
    const hash = this.hashFileName(file.name);
    const filePath = path.join(storage(disk), hash);
    await fs.writeFile(filePath, file.data);
    return filePath;
  };

  static hashFileName(fileName: string) {
    const hash = crypto.createHash("sha256").update(fileName).digest("hex");
    const fileExt = path.extname(fileName);
    return `${Date.now()}_${hash}${fileExt}`;
  };
}