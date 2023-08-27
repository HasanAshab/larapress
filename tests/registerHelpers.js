require("dotenv/config");
process.env.NODE_ENV = "test";

global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};

const server = require("~/main").default;
console.log(require("~/main"))
console.log(server)
global.request = require("supertest")(server);