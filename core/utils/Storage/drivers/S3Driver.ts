import StorageDriver from "../StorageDriver";
import { UploadedFile } from "express-fileupload";

export default class S3Driver implements StorageDriver {
  constructor() {
    throw new Error("S3 driver is not implemented yet")
  }
  async putFile(disk: string, file: UploadedFile) {};
}