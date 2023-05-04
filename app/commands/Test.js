const Command = require(base("illuminate/commands/Command"));
const User = require(base("app/models/User"));
const DB = require(base("illuminate/utils/DB"));


class Test extends Command {
  async handle(){
    this.success(this.params.msg)
  };
}

module.exports = Test;
