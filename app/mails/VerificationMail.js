class VerificationMail {
  view = 'verification';
  subject = 'Verify Email Address';
  
  constructor(data = {}){
    this.data = data
  }
}

module.exports = VerificationMail;