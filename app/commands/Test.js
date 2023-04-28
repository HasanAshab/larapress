const Command = require(base('illuminate/commands/Command'));
const User = require(base('app/models/User'));
const TestJob = require(base('app/jobs/Test'));

class Test extends Command {
  
  handle = async (msg) => {
    new TestJob().dispatch('do something').delay(2000);
    this.success();
  }
  
}


module.exports = Test;