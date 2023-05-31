import { storage } from "helpers";
import { UploadedFile } from "express-fileupload";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export default class Storage {
  static isMocked = false;
  
  static mock(): void {
    this.isMocked = true;
  }
  
  static mocked = {
    data: {
      total: 0,
      files: {} as Record<string, UploadedFile>
    },
    reset(){
      Storage.mocked.data = {
        total: 0,
        files: {}
      }
    }
  }
  
  static pushMockData(file: UploadedFile){
    this.mocked.data.total++;
    this.mocked.data.files[file.name] = file;
  }
  
  static async putFile(storage_path: string, file: UploadedFile): Promise<string>{
    const hash = this.hashFileName(file.name);
    const filePath = path.join(storage(storage_path), hash);
    if (this.isMocked) this.pushMockData(file);
    else await fs.writeFile(filePath, file.data);
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