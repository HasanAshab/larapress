class SendEmailVerificationNotification {
  static async dispatch(user){
    await user.sendVerificationEmail();
  }
}

module.exports = SendEmailVerificationNotification;