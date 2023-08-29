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
    const collections = mongoose.connection.collections;
    const dropPromises = [];
    for (const name in collections) {
      const dropPromise = collections[name].drop().catch(err => {
        if (err.codeName !== 'NamespaceNotFound') 
          throw err;
      });
      dropPromises.push(dropPromise);
    }
    return Promise.all(dropPromises);
  }
}

