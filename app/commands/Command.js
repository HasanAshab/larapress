const path = require("path");

class Command {
  constructor(subCommand = null) {
    this.subCommand = subCommand;
    global.__basedir = path.join(__dirname, "../..");
  }

  message = (text) => {
    console.log("\n", text, "\n");
  };

  success = (text) => {
    console.log("\x1b[32m", "\n", text, "\n");
    process.exit(0);
  };

  error = (text) => {
    console.log("\x1b[31m", "\n", text, "\n");
    process.exit(1);
  };

  setup = () => {
    require("dotenv").config();
    require(path.join(__basedir, "main/db"));
    require(path.join(__basedir, "main/register")).helpers();
  };

  helpers = () => {
    require("dotenv").config();
    require(path.join(__basedir, "main/register")).helpers();
  };

  connect = () => {
    require("dotenv").config();
    require(path.join(__basedir, "main/db"));
  };
}

module.exports = Command;
