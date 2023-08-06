import { Schema, Document } from "mongoose";
import { customError } from "helpers";
import twilio from "twilio";
import OTP from "app/models/OTP";
import Mail from "illuminate/utils/Mail"
import URL from "illuminate/utils/URL"
import Token from "illuminate/utils/Token";
import bcrypt from "bcryptjs";
import VerificationMail from "app/mails/VerificationMail";
import ForgotPasswordMail from "app/mails/ForgotPasswordMail";
import PasswordChangedMail from "app/mails/PasswordChangedMail";

const frontendUrl = process.env.FRONTEND_URL;
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export interface AuthenticatableDocument extends Document {
  sendVerificationEmail(): Promise<string | boolean>;
  sendResetPasswordEmail(): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  sendOtp(): number;
  verifyOtp(code: number): boolean;
}

export default (schema: Schema) => {
  const expireAfter = 3 * 24 * 60 * 60;

  schema.methods.sendVerificationEmail = async function () {
    if (this.verified) {
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
    this.password = newPassword;
    this.tokenVersion++;
    const result = await this.save();
    await Mail.to(this.email).send(new PasswordChangedMail());
    return result;
  }
  
  schema.methods.sendOtp = async function () {
    const settings = await this.settings;
    if(!settings.twoFactorAuth.enabled) return;
    const code = Math.floor(100000 + Math.random() * 900000);
    const otp = await OTP.create({ 
      userId: this._id,
      code,
      expiresAt: Date.now() + 3600000
    });
    const message = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: this.phoneNumber,
      body: "Your OTP is: " + code,
    });
    return code;
  }
  
  schema.methods.verifyOtp = async function (code: number) {
    const otp = await OTP.findOne({ userId: this._id, code });
    if(!otp) return false;
    await OTP.deleteMany({ userId: this._id });
    return true;
  }
};
