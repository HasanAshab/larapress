import { Schema } from "mongoose";
import URL from "illuminate/utils/URL"
import Token from "illuminate/utils/Token";
import bcrypt from "bcryptjs";
import AuthenticationError from "app/exceptions/AuthenticationError";
import VerificationMail from "app/mails/VerificationMail";
import ForgotPasswordMail from "app/mails/ForgotPasswordMail";
import PasswordChangedMail from "app/mails/PasswordChangedMail";

const frontendUrl = process.env.FRONTEND_URL;
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

export type IAuthenticatable = {
  emailVerified: boolean,
  sendVerificationEmail(): Promise<string | boolean>,
  sendResetPasswordEmail(): Promise<string>,
  resetPassword(token: string, newPassword: string): Promise<boolean>
}

export default (schema: Schema) => {
  const expireAfter = 3 * 24 * 60 * 60;
  
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
    const link = URL.signedRoute("email.verify", {id: this._id}, expireAfter);
    const result = await this.notify(new VerificationMail({ link }));
    return link;
  };

  schema.methods.sendResetPasswordEmail = async function (): Promise<string> {
    const resetToken = Token.create("reset_password:" + this._id, expireAfter);
    const link = URL.client(`/password/reset/${this._id}?token=${resetToken}`);
    await this.notify(new ForgotPasswordMail({ link }));
    return resetToken;
  }
  
  schema.methods.resetPassword = async function (token: string, newPassword: string): Promise<boolean> {
    const tokenIsValid = Token.isValid("reset_password:" + this._id, token);
    if (!tokenIsValid) {
      throw AuthenticationError.type("INVALID_OR_EXPIRED_TOKEN").create();
    }
    const oldPasswordMatch = await bcrypt.compare(newPassword, this.password);
    if (oldPasswordMatch) {
      throw AuthenticationError.type("PASSWORD_SHOULD_DIFFERENT").create();
    }
    this.password = newPassword;
    this.tokenVersion++;
    const result = await this.save();
    await this.notify(new PasswordChangedMail());
    return result;
  }
  
};
