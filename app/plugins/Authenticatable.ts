import { Schema, Document } from "mongoose";
import { customError } from "helpers";
import twilio from "twilio";
import Mail from "illuminate/utils/Mail"
import URL from "illuminate/utils/URL"
import Token from "illuminate/utils/Token";
import bcrypt from "bcryptjs";
import VerificationMail from "app/mails/VerificationMail";
import ForgotPasswordMail from "app/mails/ForgotPasswordMail";
import PasswordChangedMail from "app/mails/PasswordChangedMail";

const frontendUrl = process.env.FRONTEND_URL;
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

export interface AuthenticatableDocument extends Document {
  emailVerified: boolean;
  sendVerificationEmail(): Promise<string | boolean>;
  sendResetPasswordEmail(): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
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

  schema.methods.sendVerificationEmail = async function () {
    if (this.emailVerified) {
      return false;
    }
    const link = URL.signedRoute("email.verify", {id: this._id}, expireAfter);
    const result = await Mail.to(this.email).send(new VerificationMail({ link }));
    return link;
  };

  schema.methods.sendResetPasswordEmail = async function () {
    const resetToken = Token.create("reset_password:" + this._id, expireAfter);
    const link = URL.client(`/password/reset/${this._id}?token=${resetToken}`);
    await Mail.to(this.email).send(new ForgotPasswordMail({ link }));
    return resetToken;
  }
  
  schema.methods.resetPassword = async function (token: string, newPassword: string) {
    const tokenIsValid = Token.isValid("reset_password:" + this._id, token);
    if (!tokenIsValid) {
      throw customError("INVALID_OR_EXPIRED_TOKEN");
    }
    const oldPasswordMatch = await bcrypt.compare(newPassword, this.password);
    if (oldPasswordMatch) {
      throw customError("PASSWORD_SHOULD_DIFFERENT");
    }
    this.password = newPassword;
    this.tokenVersion++;
    const result = await this.save();
    await Mail.to(this.email).send(new PasswordChangedMail());
    return result;
  }
  
  schema.methods.sendOtp = async function () {
    const settings = await this.settings;
    if(!settings.twoFactorAuth.enabled) return;
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    return await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID).verifications.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: this.phoneNumber,
      channel: settings.twoFactorAuth.method
    });
  }
};
