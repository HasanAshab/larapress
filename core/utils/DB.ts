import mongoose, { ConnectOptions } from "mongoose";
import config from "config";
import Setup from "~/main/Setup";
import fs from "fs";

export default class DB {
  static defaultConnectOptions = {
    maxPoolSize: config.get<number>("db.maxPoolSize")
  }
  
  static async connect(options: ConnectOptions = this.defaultConnectOptions) {
    await mongoose.connect(config.get<any>("db.url"), options);
  }
  
  static async disconnect() {
    await mongoose.disconnect();
  }
  
  static reset() {
    const models = mongoose.modelNames();
    const promises = [];
    for (const model of models) {
      promises.push(mongoose.model(model).deleteMany({}));
    }
    return Promise.all(promises);
  }
}
