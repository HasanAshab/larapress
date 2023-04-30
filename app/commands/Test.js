const Command = require(base("illuminate/commands/Command"));
const User = require(base("app/models/User"));
const ForgotPassword = require(base("app/mails/ForgotPasswordMail"));
const Mail = require(base("illuminate/utils/Mail"));

class Test extends Command {
  handle = async () => {
    //const users = 't1@gmail.com'
    //Mail.to(users).send(new ForgotPassword({link:'blabla'}));
  
  };
}

module.exports = Test;
