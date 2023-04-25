const path = require('path');

class Command {
  constructor(subCommand = null, fromShell = true, flags = []) {
    this.subCommand = subCommand;
    this.fromShell = fromShell;
    this.flags = flags;
    this.hasFlags = flags.length > 0;
  }

  alert = (text) => {
    console.log('\x1b[33m', text);
  }

  success = (text) => {
    console.log('\x1b[32m', '\n', text, '\n');
    if(this.fromShell){
      process.exit(0);
    }
  }

  error = (text) => {
    console.log('\x1b[31m', '\n', text, '\n');
    if(this.fromShell){
      process.exit(0);
    }
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
