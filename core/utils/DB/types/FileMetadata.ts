import { SchemaType } from "mongoose";

export default class FileMetadata extends SchemaType {
  constructor(key: string, options: object) {
    super(key, options, 'FileMetadata');
  }

  cast(val: unknown) {
  }
}