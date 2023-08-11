import mongoose, { ConnectOptions } from "mongoose";
const dbUrl = process.env.DB_URL??"mongodb://127.0.0.1:27017/test";

export default class DB {
  static async connect(url?: string, options?: ConnectOptions) {
    await mongoose.connect(url || dbUrl, options);
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

