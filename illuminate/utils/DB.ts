import mongoose, { ConnectOptions } from "mongoose";
import config from "config";

export default class DB {
  static defaultConnectOptions = {
    maxPoolSize: config.get<any>("db.maxPoolSize")
  }
  
  static async connect(options: ConnectOptions = this.defaultConnectOptions) {
    await mongoose.connect(config.get<any>("db.url"), options);
  }
  
  static async disconnect() {
    await mongoose.disconnect();
  }
  
  static reset() {
    const collections = mongoose.connection.collections;
    //console.log(collections)
    const dropPromises = [];
    for (const name in collections) {
      const dropPromise = collections[name].drop();
      dropPromises.push(dropPromise);
    }
    return Promise.all(dropPromises);
  }
}

