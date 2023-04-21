const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/test";

module.exports = mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
