const Command = require(base("illuminate/commands/Command"));
const User = require(base("app/models/User"));
const ForgotPassword = require(base("app/mails/ForgotPasswordMail"));
const DB = require(base("illuminate/utils/DB"));

class Test extends Command {
  handle(){
    this.success(this.flags)
  };
}

module.exports = Test;
