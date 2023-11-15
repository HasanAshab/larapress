import Manager from "~/core/abstract/Manager";
import Config from "Config";
import StorageDriver from "./StorageDriver";
import LocalDriver from "./drivers/LocalDriver";
import { UploadedFile } from "express-fileupload";
import { Readable } from 'stream';

export default class StorageManager extends Manager implements StorageDriver {
  get defaultDriver() {
    return Config.get<string>("storage.default");
  }
  
  protected createLocalDriver() {
    return new LocalDriver(Config.get("storage.drivers.local"));
  }

  exists(path: string): Promise<boolean> {
    return this.driver().exists(path);
  }

  get(path: string): Promise<Buffer> {
    return this.driver().get(path);
  }

  put(path: string, contents: string | Buffer | Readable, options?: any): Promise<void> {
    return this.driver().put(path, contents, options);
  }

  delete(paths: string | string[]): Promise<void> {
    return this.driver().delete(paths);
  }

  copy(src: string, dest: string): Promise<void> {
    return this.driver().copy(src, dest);
  }

  move(src: string, dest: string): Promise<void> {
    return this.driver().move(src, dest);
  }

  size(path: string): Promise<number> {
    return this.driver().size(path);
  }

  lastModified(path: string): Promise<number> {
    return this.driver().lastModified(path);
  }

  directories(directory?: string): Promise<string[]> {
    return this.driver().directories(directory);
  }

  files(directory?: string): Promise<string[]> {
    return this.driver().files(directory);
  }

  makeDirectory(path: string): Promise<void> {
    return this.driver().makeDirectory(path);
  }

  deleteDirectory(directory: string): Promise<void> {
    return this.driver().deleteDirectory(directory);
  }

  putFile(directory: string, file: UploadedFile): Promise<string> {
    return this.driver().putFile(directory, file);
  }
}
