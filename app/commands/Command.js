class Command {
  constructor(subCommand = null){
    this.subCommand = subCommand;
  }
  
  message = (text) => {
    console.log('\n', text, '\n')
  }
  
  error = (text) => {
    console.log("\x1b[31m", '\n', text, '\n')
  }
  
  success = (text) => {
    console.log("\x1b[32m", '\n', text, '\n')
  }
  
}

module.exports = Command;