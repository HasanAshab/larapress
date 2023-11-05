import Manager from "~/core/abstract/Manager";
import Config from "Config";
import StorageDriver from "./StorageDriver";
import LocalDriver from "./drivers/LocalDriver";
import { UploadedFile } from "express-fileupload";

export default class StorageManager extends Manager implements StorageDriver {
  getDefaultDriver() {
    return Config.get("storage.default");
  }
  
  protected createLocalDriver() {
    return new LocalDriver(Config.get("storage.drivers.local"));
  }

  putFile(disk: string, file: UploadedFile) {
    return this.driver().putFile(disk, file);
  }
}