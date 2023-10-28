import Manager from "~/core/abstract/Manager";
import Config from "Config";
import StorageDriver from "./StorageDriver";
import LocalDriver from "./drivers/LocalDriver";
import S3Driver from "./drivers/S3Driver";
import { UploadedFile } from "express-fileupload";

export default class StorageManager extends Manager implements StorageDriver {
  protected getDefaultDriver() {
    return Config.get("storage.default");
  }
  
  protected createLocalDriver() {
    return new LocalDriver();
  }
  
  protected createS3Driver() {
    return new S3Driver();
  }
  
  disk(name: string) {
    const diskConfig = Config.get("storage.disks." + name);
    console.log(diskConfig)
  }
  
  putFile(disk: string, file: UploadedFile) {
    return this.driver().putFile(disk, file);
  }
}