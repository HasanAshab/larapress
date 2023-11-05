import StorageDriver from "../StorageDriver";
import { UploadedFile } from "express-fileupload";
import fs from "fs/promises";
import { join } from "path";


export default class LocalDriver implements StorageDriver {
  constructor(private readonly config: { root: string }) {
    this.config = config;
  }
  
  async putFile(path: string, file: UploadedFile) {
    const name = `${Date.now()}_${file.name}`;
    const filePath = join(this.config.root, path, name);
    await fs.writeFile(filePath, file.data);
    return name;
  }
}