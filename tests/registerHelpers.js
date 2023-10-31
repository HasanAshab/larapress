process.env.NODE_ENV = "test";
require("~/main");

const app = require("~/main/app").default
const request = require("supertest")(app.server);

const version = "v1";
const methods = ["get", "post", "put", "patch", "delete"];
for(const method of methods) {
  const realHandler = request[method];
  request[method] = function(subUrl) {
    const obj = realHandler.call(request, "/api/" + version + subUrl);
    obj.actingAs = function(token) {
      return obj.set("Authorization", `Bearer ${token}`)
    }
    obj.multipart = function(data) {
      for(const fieldName in data){
        const value = data[fieldName];
        if(value._type === "file")
          obj.attach(fieldName, value.path);
        else obj.field(fieldName, value);
      }
      return obj
    }
    return obj;
  }
}

global.request = request;


global.fakeFile = (name) => {
  return {
    _type: "file",
    path: `storage/test_files/${name}`
  }
};