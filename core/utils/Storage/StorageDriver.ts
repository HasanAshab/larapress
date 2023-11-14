import { Readable } from 'stream';
import { UploadedFile } from "express-fileupload";

export default interface StorageDriver {
  exists(path: string): Promise<boolean>;
  get(path: string): Promise<Buffer>;
  put(path: string, contents: string | Buffer | Readable, options?: any): Promise<void>;
  delete(paths: string | string[]): Promise<void>;
  copy(src: string, dest: string): Promise<void>;
  move(src: string, dest: string): Promise<void>;
  size(path: string): Promise<number>;
  lastModified(path: string): Promise<number>;
  directories(directory?: string): Promise<string[]>;
  files(directory?: string): Promise<string[]>;
  makeDirectory(path: string): Promise<void>;
  deleteDirectory(directory: string): Promise<void>;
  putFile(directory: string, file: UploadedFile): Promise<string>;
}
