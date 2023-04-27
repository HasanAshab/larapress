const Command = require(base('illuminate/commands/Command'));
const User = require(base('app/models/User'));
//const UserFactory = require()

class Test extends Command {
  
  handle = async (msg) => {
    this.success(this.hasFlag('hzh'));
  }
  
}


module.exports = Test;