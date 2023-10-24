import { UploadedFile } from "express-fileupload";

export default class Mockable {
  static $data: Record<string, {file: UploadedFile, disk: string}> = {}
  
  static mockClear() {
    this.$data = {};
  }
  
  static async putFile(disk: string, file: UploadedFile) {
    this.$data[file.name] = { file, disk };
    return "";
  }
  
  static assertNothingStored(){
    expect(Object.keys(this.$data)).toHaveLength(0);
  }
  
  static assertStoredCount(expectedNumber: number){
    expect(Object.keys(this.$data)).toHaveLength(expectedNumber);
  }
  
  static assertStored(filename: string){
    expect(this.$data[filename]).not.toBe(undefined);
  }
}