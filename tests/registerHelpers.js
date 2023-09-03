require("dotenv/config");
process.env.NODE_ENV = "test";

global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};

const server = require("~/main").default;
global.request = require("supertest")(server);
global.sleep = function(miliseconds) {
  return new Promise(r => setTimeout(r, miliseconds));
}