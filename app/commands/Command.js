const path = require("path");

class Command {
  constructor(subCommand = null) {
    this.subCommand = subCommand;
  }

  message = (text) => {
    console.log("\n", text, "\n");
  }

  success = (text) => {
    console.log("\x1b[32m", "\n", text, "\n");
    process.exit(0);
  }

  error = (text) => {
    console.log("\x1b[31m", "\n", text, "\n");
    process.exit(1);
  }

  helpers = () => {
    require(path.join(__basedir, "main/register")).helpers();
  }

  connect = () => {
    require(path.join(__basedir, "main/db"));
  }
  
  setup = () => {
    this.connect();
    this.helpers();
  }

}

module.exports = Command;
