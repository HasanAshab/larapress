const Command = require(base('app/commands/Command'));

class Test extends Command {
  
  handle = () => {
    console.log("hshs")
  }
  
}


module.exports = Test;