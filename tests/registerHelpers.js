require("dotenv").config();
require("../helpers");
const mongoose = require("mongoose");

global.fakeFile = (name) => {
  return storage(`test_files/${name}`);
};

global.resetDatabase = async () => {
  const models = mongoose.modelNames();
  for (const model of models){
    await mongoose.model(model).deleteMany({});
  };
};
