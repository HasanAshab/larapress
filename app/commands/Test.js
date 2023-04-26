const Command = require(base('app/commands/Command'));
const User = require(base('app/models/User'));
//const UserFactory = require()
class Test extends Command {
  
  handle = async (msg) => {
    this.connect()
    this.success(await User.factory(1).create({name:"jsjs"}))
    
  }
  
}


module.exports = Test;