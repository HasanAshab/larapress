import { storage } from "helpers";
import { File } from "types";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export default class Storage {
  static isMocked = false;
  
  static mock(): void {
    this.isMocked = true;
  }
  
  static async putFile(storage_path: string, file: File): Promise<string>{
    const hash = this.hashFileName(file.originalname);
    const filePath = path.join(storage(storage_path), hash);
    if (!this.isMocked) await fs.writeFile(filePath, file.buffer);
    return filePath;
  };

  static hashFileName(fileName: string): string {
    const hash = crypto
      .createHash("md5")
      .update(fileName)
      .digest("hex")
      .substring(0, 15);
    const fileExt = path.extname(fileName);
    const hashedFileName = `${Date.now()}_${hash}${fileExt}`;
    return hashedFileName;
  };
}