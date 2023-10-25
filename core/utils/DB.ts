import mongoose, { ConnectOptions } from "mongoose";
import Config from "Config";
import fs from "fs";

export default class DB {
  static async connect() {
    await mongoose.connect(Config.get("database.url"), Config.get("database.options"));
  }
  
  static async disconnect() {
    await mongoose.disconnect();
  }
  
  static async reset(models = mongoose.modelNames()) {
    const promises = [];
    for (const name of models)
      promises.push(mongoose.model(name).deleteMany());
    await Promise.all(promises);
  }
}

