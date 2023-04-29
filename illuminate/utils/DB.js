const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/test";

class DB {
  static async connect(url) {
    return await mongoose.connect(url || dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  
  static async disconnect() {
    await mongoose.disconnect();
  }
}

module.exports = DB;