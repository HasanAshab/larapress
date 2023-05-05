require("dotenv").config();
require("../helpers");
const mongoose = require("mongoose");

global.fakeFile = (name) => {
  return storage(`test_files/${name}`);
};

global.resetDatabase = () => {
  afterEach(async () => {
    const models = mongoose.modelNames();
    models.forEach(async (model) => {
      await mongoose.model(model).deleteMany({});
    });
  });
};