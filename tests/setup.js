require("dotenv/config");
const DB = require("../illuminate/utils/DB").default;

module.exports = async function (globalConfig, projectConfig) {
  await DB.connect();
  await DB.reset();
}
