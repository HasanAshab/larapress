const Command = require(base("illuminate/commands/Command"));
const User = require(base("app/models/User"));
const DB = require(base("illuminate/utils/DB"));


class Test extends Command {
  async handle(){
    middleware('test:aa')()
  };
}

module.exports = Test;
