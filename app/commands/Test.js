const Command = require(base('illuminate/commands/Command'));
const User = require(base('app/models/User'));
const AuthenticationError = require(base('app/exceptions/AuthenticationError'));

class Test extends Command {
  
  handle = async (msg) => {
    new AuthenticationError().throw('sjsb')
    this.success(this.hasFlag('hzh'));
  }
  
}


module.exports = Test;