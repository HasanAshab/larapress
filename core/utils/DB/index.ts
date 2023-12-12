import { connect, disconnect, syncIndexes, model, modelNames, ConnectOptions, Document } from "mongoose";
import Config from "Config";
import fs from "fs";
import expect from "expect";

export default class DB {
  static async connect() {
    await connect(Config.get("database.url"), Config.get("database.options"));
    await syncIndexes();
  }
  
  static async disconnect() {
    await disconnect();
  }
  
  static async reset(models = modelNames()) {
    const promises = [];
    for (const name of models)
      promises.push(model(name).deleteMany());
    await Promise.all(promises);
  }
  
  static model(name: string) {
    const Model = model(name);
    
    Model.assertCount = async function(expectedCount: number) {
      expect(await this.count()).toBe(expectedCount);
    }
    
    Model.assertHas = async function(data: object) {
      const document = await this.findOne(data);
      expect(document).not.toBeNull();
    }
    
    Model.assertMissing = async function(data: object) {
      const document = await this.findOne(data);
      expect(document).toBeNull();
    }
    
    Model.assertDocumentExists = async function(document: Document) {
      expect(await document.exists).toBe(true);
    }
    
    return Model;
  }
}