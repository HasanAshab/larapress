const URL = require(base('illuminate/utils/URL')).default;
const appName = process.env.APP_NAME;

module.exports = {
  swagger: "2.0",
  info: {
    title: `${appName} API Docs`,
  },
  host: URL.resolve(),
  basePath: "/api/",
  schemes: ["http"],
  paths: {}
};