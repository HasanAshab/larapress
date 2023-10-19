process.env.NODE_ENV = "test";

require("~/main");
const URL = require("URL").default;

global.request = require("superagent");

function setupAgent() {
  const version = "v1";
  const methods = ["get", "post", "put", "delete"];
  for(const method of methods) {
    const realHandler = request[method];
    request[method] = function(subUrl) {
      const obj = realHandler.call(request, URL.resolve("/api/" + version + subUrl));
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
}

setupAgent();


global.fakeFile = (name) => {
  return {
    _type: "file",
    path: `storage/test_files/${name}`
  }
};