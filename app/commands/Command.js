const path = require('path');

class Command {
  constructor(subCommand = null) {
    this.subCommand = subCommand;
  }

  message = (text) => {
    console.log('\n', text, '\n');
  }

  success = (text) => {
    console.log('\x1b[32m', '\n', text, '\n');
    process.exit(0);
  }

  error = (text) => {
    console.log('\x1b[31m', '\n', text, '\n');
    process.exit(1);
  }
  
  connect = async () => {
    const connection = require(base('main/connection'));
    try{
      await connection;
    }
    catch (err){
      console.error(err);
    }
  }
}

module.exports = Command;
