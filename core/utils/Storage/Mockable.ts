import { UploadedFile } from "express-fileupload";
import expect from "expect";

export default class Mockable {
  static isMocked = false;
  static mocked: Record<string, {file: UploadedFile, disk: string}> = {}
  
  static mock() {
    this.isMocked = true;
    this.mocked = {};
  }
  
  static putFile(disk: string, file: UploadedFile) {
    this.mocked[file.name] = { file, disk };
    return disk;
  }
  
  static assertNothingStored(){
    expect(Object.keys(this.mocked)).toHaveLength(0);
  }
  
  static assertStoredCount(expectedNumber: number){
    expect(Object.keys(this.mocked)).toHaveLength(expectedNumber);
  }
  
  static assertStored(filename: string){
    expect(this.mocked).toHaveProperty([filename]);
  }
}