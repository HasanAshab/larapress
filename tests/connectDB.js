require("dotenv/config")
const DB = require("../illuminate/utils/DB").default;
const dbUrl = process.env.TEST_DB_URL || process.env.DB_URL
module.exports = DB.connect(dbUrl);