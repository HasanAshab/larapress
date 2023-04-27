require("dotenv").config();
require("../helpers");
const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/test";

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

global.connect = async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};