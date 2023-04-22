class ForgotPasswordMail {
  view = 'forgotPassword';
  subject = 'Reset Password';
  
  constructor(data = {}){
    this.data = data
  }
  
  via = () => {
    return ['database', 'mail']
  }
  
}

module.exports = ForgotPasswordMail;