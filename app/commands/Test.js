const Command = require(base('illuminate/commands/Command'));
const User = require(base('app/models/User'));
const AuthenticationError = require(base('app/errors/AuthenticationError'));

class Test extends Command {
  
  handle = async (msg) => {
    new AuthenticationError().throw('INVALID_OR_EXPIRED_TOKEN')
    this.success(this.hasFlag('hzh'));
  }
  
}


module.exports = Test;