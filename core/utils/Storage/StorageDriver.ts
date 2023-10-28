export default interface StorageDriver {
  putFile(disk: string, file: UploadedFile): Promise<string>;
}