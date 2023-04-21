module.exports = schema => {
  schema.methods.sendVerificationEmail = async function () {
    if(this.emailVerified){
      return Promise.reject("Account already verified");
    }
    await Token.deleteMany({
      userId: this._id,
      for: 'email_verification'
    });
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, bcryptRounds);
    const token = await Token.create({
      userId: this._id,
      token: hash,
      for: 'email_verification'
    });
    const link = url(`/api/auth/verify?id=${this._id}&token=${resetToken}`);
    return this.notify(new VerificationMail({link}));
  }
}