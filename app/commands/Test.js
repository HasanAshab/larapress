const Command = require(base("illuminate/commands/Command"));
const Cache = require(base("illuminate/utils/Cache"));
const User = require(base("app/models/User"));
const DB = require(base("illuminate/utils/DB"));


class Test extends Command {
  async handle(){
    Cache.put('foo', 'data', 100)
    const data = await Cache.driver('redis').get('foo');
    console.log(data);
  };
}

module.exports = Test;
