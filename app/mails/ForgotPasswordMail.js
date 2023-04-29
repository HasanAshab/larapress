const Queueable = require(base('illuminate/queue/Queueable'));

class ForgotPasswordMail extends Queueable {
  view = 'forgotPassword';
  subject = 'Reset Password';
  
  constructor(data = {}){
    super();
    this.data = data;
  }
  
  via = () => {
    return ['database', 'mail']
  }
  
}

module.exports = ForgotPasswordMail;