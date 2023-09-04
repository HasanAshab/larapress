require("dotenv/config");
process.env.NODE_ENV = "test";

const server = require("~/main").default;

const request = require("supertest")(server);
const methods = ["get", "post", "put", "delete"];
for(const method of methods) {
  const realHandler = request[method];
  request[method] = function(subUrl) {
    return realHandler.call(request, "/api" + subUrl);
  }
}
global.request = request;


global.sleep = function(miliseconds) {
  return new Promise(r => setTimeout(r, miliseconds));
}

global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};
