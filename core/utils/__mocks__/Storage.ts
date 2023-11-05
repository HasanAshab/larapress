import expect from "expect";
import { UploadedFile } from "express-fileupload";
import MockDataContainer from "~/tests/MockDataContainer";

export default class Storage {
  static mockClear() {
    MockDataContainer.Storage = {};
  }
  
  static async putFile(disk: string, file: UploadedFile) {
    MockDataContainer.Storage[file.name] = { file, disk };
    return "";
  }
  
  static assertNothingStored(){
    expect(Object.keys(MockDataContainer.Storage)).toHaveLength(0);
  }
  
  static assertStoredCount(expectedNumber: number){
    expect(Object.keys(MockDataContainer.Storage)).toHaveLength(expectedNumber);
  }
  
  static assertStored(filename: string){
    expect(MockDataContainer.Storage[filename]).not.toBe(undefined);
  }
}

Storage.mockClear();