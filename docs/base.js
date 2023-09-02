const URL = require('URL').default;
const config = require("config");

module.exports = {
  swagger: "2.0",
  info: {
    title: `${config.get("app.name")} API Docs`,
  },
  host: URL.resolve(),
  basePath: "/api/",
  schemes: ["http"],
  paths: {}
};