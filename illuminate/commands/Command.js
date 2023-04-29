class Command {
  constructor(subCommand, fromShell = true, flags = {}) {
    this.subCommand = subCommand;
    this.fromShell = fromShell;
    this.flags = flags;
  }
  
  hasFlag(name){
    return this.flags[name] !== undefined 
  }

  alert(text){
    console.log('\x1b[33m', text, '\x1b[0m');
  }

  success(text){
    console.log('\x1b[32m', '\n', text, '\n', '\x1b[0m');
    if(this.fromShell){
      process.exit(0);
    }
  }

  error(text){
    console.log('\x1b[31m', '\n', text, '\n', '\x1b[0m');
    if(this.fromShell){
      process.exit(0);
    }
  }
}

module.exports = Command;
