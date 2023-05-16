import { Schema } from 'mongoose';
import { base, url, clientUrl, log } from "helpers";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import AuthenticationError from 'app/exceptions/AuthenticationError';
import VerificationMail from "app/mails/VerificationMail";
import ForgotPasswordMail from "app/mails/ForgotPasswordMail";
import PasswordChangedMail from "app/mails/PasswordChangedMail";
import Token from "app/models/Token";

const frontendUrl = process.env.FRONTEND_URL;
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

export type IAuthenticatable = {
  emailVerified: boolean,
  sendVerificationEmail(): Promise<string | boolean>,
  sendResetPasswordEmail(): Promise<string>,
  resetPassword(token: string, newPassword: string): Promise<boolean>
}

export default (schema: Schema) => {
  schema.add({
    emailVerified: {
      type: Boolean,
      default: false,
      required: true
    },
  });

  schema.methods.sendVerificationEmail = async function (): Promise<string | boolean> {
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
    return verificationToken;
  };

  schema.methods.sendResetPasswordEmail = async function (): Promise<string> {
    Token.deleteMany({
      userId: this._id,
      for: "password_reset",
    }).catch((err: any) => log(err));
    const resetToken = crypto.randomBytes(32).toString("hex");
    const token = await Token.create({
      userId: this._id,
      token: resetToken,
      for: "password_reset",
    });
    const link = clientUrl(`/password/reset?id=${this._id}&token=${resetToken}`);
    await this.notify(new ForgotPasswordMail({ link }));
    return resetToken;
  }
  
  schema.methods.resetPassword = async function (token: string, newPassword: string): Promise<boolean> {
    const resetToken = await Token.findOne({
      userId: this._id,
    });
    if (!resetToken) {
      throw AuthenticationError.type('INVALID_OR_EXPIRED_TOKEN').create();
    }
    const tokenMatch = await bcrypt.compare(token, resetToken.token);
    if (!tokenMatch) {
      throw AuthenticationError.type('INVALID_OR_EXPIRED_TOKEN').create();
    }
    const oldPasswordMatch = await bcrypt.compare(newPassword, this.password);
    if (oldPasswordMatch) {
      throw AuthenticationError.type('PASSWORD_SHOULD_DIFFERENT').create();
    }
    this.password = newPassword;
    this.tokenVersion++;
    const result = await this.save();
    resetToken.deleteOne().catch((err: any) => log(err));
    this.notify(new PasswordChangedMail());
    return result;
  }
  
};
