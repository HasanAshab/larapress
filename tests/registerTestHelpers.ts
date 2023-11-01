import app from "~/main/app";
import supertest from "supertest";

const request = supertest(app.server);
// TODO rm it
const version = "v1";
const methods = ["get", "post", "put", "patch", "delete"];
for(const method of methods) {
  const realHandler = request[method];
  request[method] = function(subUrl: string) {
    const obj = realHandler.call(request, "/api/" + version + subUrl);
    obj.actingAs = function(token: string) {
      return obj.set("Authorization", `Bearer ${token}`)
    }
    obj.multipart = function(data: Record<string, any>) {
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


global.fakeFile = (name: string) => {
  return {
    _type: "file",
    path: `storage/test_files/${name}`
  }
};