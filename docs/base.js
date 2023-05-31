//const projectDetails = require(base('package'));
const appName = process.env.APP_NAME;

module.exports = {
  swagger: "2.0",
  info: {
    title: `${appName} API Docs`,
  },
  host: url(),
  basePath: "/api/",
  schemes: ["http"],
  paths: {}
};