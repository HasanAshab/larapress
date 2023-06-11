const DB = require("../illuminate/utils/DB").default;

module.exports = async function () {
  await DB.disconnect();
}
