require("dotenv/config");
process.env.NODE_ENV = "test";

const path = require("path");
const fs = require("fs");
const DB = require("illuminate/utils/DB").default;


global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};

const server = require("main").default;
global.request = require("supertest")(server);


global.resetDatabase = DB.reset;