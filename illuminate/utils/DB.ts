import mongoose, { ConnectOptions } from "mongoose";
const dbUrl = process.env.DB_URL??"mongodb://127.0.0.1:27017/test";

export default class DB {
  static async connect(url?: string, options?: ConnectOptions) {
    await mongoose.connect(url || dbUrl, options);
  }
  
  static async disconnect() {
    await mongoose.disconnect();
  }
}

