require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

process.env.CACHE = process.env.TEST_CACHE ?? "memory";
process.env.LOG = "console";

global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};

global.resetDatabase = async () => {
  const models = mongoose.modelNames();
  const promises = [];
  for (const model of models) {
    promises.push(mongoose.model(model).deleteMany({}));
  }
  await Promise.all(promises);
};

