const Command = require(base('illuminate/commands/Command'));
const User = require(base('app/models/User'));
//const TestJob = require(base('app/jobs/Test'));

class Test extends Command {
  
  handle = async () => {
    this.success(controller('AuthController'));
  }
  
}


module.exports = Test;