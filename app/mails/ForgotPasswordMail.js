class ForgotPasswordMail {
  view = 'forgotPassword';
  subject = 'Reset Password';

  constructor(data = {}){
    this.data = data;
  }
}

module.exports = ForgotPasswordMail;