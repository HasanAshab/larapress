import mongoose, { ConnectOptions } from "mongoose";
import config from "config";

export default class DB {
  static defaultConnectOptions = {
    maxPoolSize: config.get("db.maxPoolSize")
  }
  
  static async connect(options: ConnectOptions = this.defaultConnectOptions) {
    await mongoose.connect(config.get("db.url"), options);
  }
  
  static async disconnect() {
    await mongoose.disconnect();
  }
  
  static reset() {
    const collections = mongoose.connection.collections;
    const dropPromises = [];
    for (const name in collections) {
      const dropPromise = new Promise((resolve, reject) => {
        collections[name].drop((err) => {
          if (err && err.code !== 26) {
            reject(err);
          } 
          else resolve();
        });
      });
      dropPromises.push(dropPromise);
    }
    return Promise.all(dropPromises);
  }
}

