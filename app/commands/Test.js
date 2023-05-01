const Command = require(base("illuminate/commands/Command"));
const User = require(base("app/models/User"));
const ForgotPassword = require(base("app/mails/ForgotPasswordMail"));
const DB = require(base("illuminate/utils/DB"));

class Test extends Command {
  ab = 12
  handle(){
    console.log('dns')
    this.success(this.ab)
  };
}

module.exports = Test;
