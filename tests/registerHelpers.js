const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const fs = require("fs");
const DB = require("illuminate/utils/DB").default;

const testEnv = dotenv.parse(fs.readFileSync(".env.test"));
for(const key in testEnv){
  process.env[key] = testEnv[key];
}

global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};

global.resetDatabase = DB.reset;