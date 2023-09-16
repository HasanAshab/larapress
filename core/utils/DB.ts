import mongoose, { ConnectOptions } from "mongoose";
import config from "config";
import Setup from "~/main/Setup";
import fs from "fs";

export default class DB {
  static async connect() {
    await mongoose.connect(config.get<string>("db.url"), config.get<ConnectOptions>("db.options"));
  }
  
  static async disconnect() {
    await mongoose.disconnect();
  }
  
  static async reset(models?: string[]) {
    models = models ?? mongoose.modelNames();
    const promises = [];
    for (const name of models)
      promises.push(mongoose.model(name).deleteMany());
    await Promise.all(promises);
  }
}

