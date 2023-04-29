const Queueable = require(base('illuminate/queue/Queueable'));

class ForgotPasswordMail extends Queueable {
  view = 'forgotPassword';
  subject = 'Reset Password';
  shouldQueue = true;
  
  constructor(data = {}){
    super();
    this.data = data;
  }
}

module.exports = ForgotPasswordMail;