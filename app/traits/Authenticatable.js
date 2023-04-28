const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const AuthenticationError = require(base('app/exceptions/AuthenticationError'));
const VerificationMail = require(base("app/mails/VerificationMail"));
const ForgotPasswordMail = require(base("app/mails/ForgotPasswordMail"));
const PasswordChanged = require(base("app/mails/PasswordChanged"));
const Token = require(base("app/models/Token"));
const frontendUrl = process.env.FRONTEND_URL;
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

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
  
  schema.methods.resetPassword = async function (token, newPassword) {
    const resetToken = await Token.findOne({
      userId: this._id,
    });
    if (!resetToken) {
      new AuthenticationError().throw('INVALID_OR_EXPIRED_TOKEN');
    }
    const tokenMatch = await bcrypt.compare(token, resetToken.token);
    if (!tokenMatch) {
      new AuthenticationError().throw('INVALID_OR_EXPIRED_TOKEN');
    }
    const oldPasswordMatch = await bcrypt.compare(newPassword, this.password);
    if (oldPasswordMatch) {
      new AuthenticationError().throw('PASSWORD_SHOULD_DIFFERENT');
    }
    this.password = newPassword;
    this.tokenVersion++;
    await this.save();
    resetToken.deleteOne().catch((err) => log(err));
    this.notify(new PasswordChanged());
  }
  
};
