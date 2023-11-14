import { Readable } from 'stream';
import fs from 'fs/promises';
import { join } from 'path';
import { UploadedFile } from "express-fileupload";
import StorageDriver from '../StorageDriver';

export default class LocalDriver implements StorageDriver {
  constructor(private readonly config: { root: string }) {}
  
  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(join(this.config.root, path));
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  async get(path: string): Promise<Buffer> {
    const filePath = join(this.config.root, path);
    return fs.readFile(filePath);
  }

  async put(path: string, contents: string | Buffer | Readable): Promise<void> {
    const filePath = join(this.config.root, path);

    if (contents instanceof Readable) {
      // If contents is a readable stream, write it to the file
      const writeStream = fs.createWriteStream(filePath);
      contents.pipe(writeStream);
      return new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
    } else {
      // If contents is a string or buffer, write it directly to the file
      await fs.writeFile(filePath, contents);
    }
  }

  async delete(paths: string | string[]): Promise<void> {
    const filesToDelete = Array.isArray(paths) ? paths : [paths];
    await Promise.all(filesToDelete.map((path) => fs.unlink(join(this.config.root, path))));
  }

  async copy(src: string, dest: string): Promise<void> {
    const srcPath = join(this.config.root, src);
    const destPath = join(this.config.root, dest);
    await fs.copyFile(srcPath, destPath);
  }

  async move(src: string, dest: string): Promise<void> {
    await this.copy(src, dest);
    await this.delete(src);
  }

  async size(path: string): Promise<number> {
    const filePath = join(this.config.root, path);
    const stat = await fs.stat(filePath);
    return stat.size;
  }

  async lastModified(path: string): Promise<number> {
    const filePath = join(this.config.root, path);
    const stat = await fs.stat(filePath);
    return stat.mtimeMs;
  }

  async directories(directory = ''): Promise<string[]> {
    const dirPath = join(this.config.root, directory);
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  }

  async files(directory = ''): Promise<string[]> {
    const dirPath = join(this.config.root, directory);
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  }

  async makeDirectory(path: string): Promise<void> {
    const dirPath = join(this.config.root, path);
    await fs.mkdir(dirPath, { recursive: true });
  }

  async deleteDirectory(directory: string): Promise<void> {
    const dirPath = join(this.config.root, directory);
    await fs.rm(dirPath, { recursive: true, force: true });
  }
  
  async putFile(path: string, file: UploadedFile) {
    const name = `${Date.now()}_${file.name}`;
    const filePath = join(this.config.root, path, name);
    await fs.writeFile(filePath, file.data);
    return name;
  }
}
