import mongoose, { ConnectOptions } from "mongoose";

export default class DB {
  static url = process.env.DB_URL ?? "mongodb://127.0.0.1:27017/test";
  static defaultConnectOptions = {
    maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE) ?? 5
  }
  
  static async connect(options: ConnectOptions = this.defaultConnectOptions) {
    await mongoose.connect(this.url, options);
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

