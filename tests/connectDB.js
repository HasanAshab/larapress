require("dotenv/config")
const DB = require("../illuminate/utils/DB").default;

module.exports = DB.connect();