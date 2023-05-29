require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const nodemailerMock = require("nodemailer-mock");


global.base = (base_path = "") => {
  return path.join(path.join(__dirname, "../dist"), base_path);
}

global.fakeFile = (name) => {
  return `storage/test_files/${name}`;
};

global.resetDatabase = async () => {
  const models = mongoose.modelNames();
  const promises = [];
  for (const modelName of models) {
    const Model = mongoose.model(modelName);
    promises.push(Model.deleteMany({}));
  }
  await Promise.all(promises);
};

global.waitForEmailsSent = async function(expectedCount, timeout = 100000, interval = 500) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    const mails = nodemailerMock.mock.getSentMail();
    if (mails.length === expectedCount) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}
