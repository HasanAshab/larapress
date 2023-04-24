const Command = require(base('app/commands/Command'));

class Test extends Command {
  
  handle = (msg) => {
    console.log(msg)
  }
  
}


module.exports = Test;