const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const testEnv = dotenv.parse(fs.readFileSync(".env.test"));
for(const key in testEnv){
  process.env[key] = testEnv[key];
}

global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};

global.resetDatabase = () => {
  const collections = mongoose.connection.collections;
  const dropPromises = [];

  for (const name in collections) {
    const dropPromise = new Promise((resolve, reject) => {
      collections[name].drop((err) => {
        if (err && err.code !== 26) {
          reject(err);
        } 
        else resolve();
      });
    });
    dropPromises.push(dropPromise);
  }
  return Promise.all(dropPromises);
};
