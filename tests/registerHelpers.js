require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
global.base = (base_path = '') => {
  return path.join(path.join(__dirname, '../dist'), base_path);
}

const { storage } = require("../dist/helpers");


global.fakeFile = (name) => {
  return storage(`test_files/${name}`);
};

global.resetDatabase = async () => {
  const models = mongoose.modelNames();
  for (const model of models){
    await mongoose.model(model).deleteMany({});
  };
};
