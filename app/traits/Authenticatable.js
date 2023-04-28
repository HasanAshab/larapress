const crypto = require("crypto");
const VerificationMail = require(base("app/mails/VerificationMail"));
const ForgotPasswordMail = require(base("app/mails/ForgotPasswordMail"));
const Token = require(base("app/models/Token"));
const frontendUrl = process.env.FRONTEND_URL;

module.exports = (schema) => {
  schema.add({
    emailVerified: {
      type: Boolean,
      default: false,
    },
  });

  schema.methods.sendVerificationEmail = async function () {
    if (this.emailVerified) {
      return false;
    }
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const token = await Token.create({
      userId: this._id,
      token: verificationToken,
      for: "email_verification",
    });
    const link = url(`/api/auth/verify?id=${this._id}&token=${verificationToken}`);
    const result = await this.notify(new VerificationMail({ link }));
    return result? verificationToken : false;
  };

  schema.methods.sendResetPasswordEmail = async function () {
    Token.deleteMany({
      userId: this._id,
      for: "password_reset",
    }).catch((err) => log(err));
    const resetToken = crypto.randomBytes(32).toString("hex");
    const token = await Token.create({
      userId: this._id,
      token: resetToken,
      for: "password_reset",
    });
    const link = `${frontendUrl}/password/reset?id=${this._id}&token=${resetToken}`;
    const result = await this.notify(new ForgotPasswordMail({ link }));
    return result? resetToken : false;
  };
  
  schema.methods.resetPassword = async function () {
    
  }
  
};
