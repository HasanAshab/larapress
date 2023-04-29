const Command = require(base('illuminate/commands/Command'));
const User = require(base('app/models/User'));
const ForgotPassword = require(base('app/mails/ForgotPasswordMail'));
const Mail = require(base('illuminate/utils/Mail'));

class Test extends Command {
  
  handle = async () => {
    for(let i = 0; i < 3; i++){
      Mail.to('foo@gmail.com').after(5000).send(new ForgotPassword({link:'blabla'}));
    }
    console.log('sending started..')
  }
}


module.exports = Test;