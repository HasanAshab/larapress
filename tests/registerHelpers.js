require("dotenv/config");
process.env.NODE_ENV = "test";

const server = require("~/main").default;
const request = require("supertest")(server);
const { getVersion } = require("helpers");

let version = null;
const methods = ["get", "post", "put", "delete"];
for(const method of methods) {
  const realHandler = request[method];
  request[method] = function(subUrl) {
    version = version ?? getVersion();
    const obj = realHandler.call(request, "/api/" + version + subUrl);
    obj.actingAs = function(token) {
      return obj.set("Authorization", `Bearer ${token}`)
    }
    return obj;
  }
}

global.request = request;

global.sleep = function(miliseconds) {
  return new Promise(r => setTimeout(r, miliseconds));
}

global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};
