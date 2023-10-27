import { UploadedFile } from "express-fileupload";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export default class StorageManager {
  
  static async putFile(disk: string, file: UploadedFile) {
    return this.driver().putFile(disk, file);
  };

  static hashFileName(fileName: string) {
    const hash = crypto.createHash("sha256").update(fileName).digest("hex");
    const fileExt = path.extname(fileName);
    return `${Date.now()}_${hash}${fileExt}`;
  };
}