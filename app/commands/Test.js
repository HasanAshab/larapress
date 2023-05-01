const Command = require(base("illuminate/commands/Command"));
const Cache = require(base("illuminate/utils/Cache"));
const User = require(base("app/models/User"));
const DB = require(base("illuminate/utils/DB"));
const AuthenticationError = require(base('app/exceptions/AuthenticationError'));


class Test extends Command {
  async handle(){
    throw AuthenticationError.type('PASSWORD_SHOULD_DIFFERENT').create({ehe:'hee'});
  };
}

module.exports = Test;
