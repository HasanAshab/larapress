import { Schema, Document } from "mongoose";
import config from "config";
import { sendMessage, sendCall } from "~/core/services/twilio";
import otpConfig from "~/register/otp"
import OTP from "~/app/models/OTP";
import Token from "~/app/models/Token";
import Mail from "Mail"
import URL from "URL"
import bcrypt from "bcryptjs";
import VerificationMail from "~/app/mails/VerificationMail";
import ForgotPasswordMail from "~/app/mails/ForgotPasswordMail";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";


export interface AuthenticatableDocument extends Document {
  setPassword(password: string): Promise<void>;
  attempt(password: string): Promise<boolean>;
  sendVerificationEmail(): Promise<string>;
  sendResetPasswordEmail(): Promise<string | null>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  sendOtp(method: typeof otpConfig["methods"][number], phoneNumber?: string): Promise<number | null>;
  verifyOtp(code: number): Promise<boolean>;
}

export default (schema: Schema) => {
  schema.methods.setPassword = async function (password: string) {
    const bcryptRounds = config.get<number>("bcrypt.rounds");
    this.password = await bcrypt.hash(password, bcryptRounds);
  }
  
  schema.methods.attempt = function (password: string) {
    return bcrypt.compare(password, this.password);
  }
  
  schema.methods.sendVerificationEmail = async function () {
    if (this.verified)
      throw new Error("The user is already verified: \n" + this);
    const link = await URL.signedRoute("email.verify", { id: this._id }, 259200);
    await Mail.to(this.email).send(new VerificationMail({ link }));
    return link;
  };

  schema.methods.sendResetPasswordEmail = async function () {
    if(!this.password) return null;
    const { secret } = await Token.create({
      type: "resetPassword",
      key: this._id,
      expiresAt: Date.now() + 259200
    });
    const link = URL.client(`/password/reset/${this._id}?token=${secret}`);
    Mail.to(this.email).send(new ForgotPasswordMail({ link }));
    return secret;
  }

  schema.methods.resetPassword = async function (token: string, newPassword: string) {
    const tokenIsValid = await Token.isValid(this._id, "resetPassword", token);
    if (!tokenIsValid) {
      return false;
    }
    await this.setPassword(newPassword);
    this.tokenVersion++;
    const result = await this.save();
    Mail.to(this.email).send(new PasswordChangedMail());
    return true;
  }
  
  schema.methods.sendOtp = async function (method?: typeof otpConfig["methods"][number], phoneNumber: string = this.phoneNumber) {
    if(!phoneNumber) return null;
    const settings = await user.settings;
    if(!settings.twoFactorAuth.enabled) return null;
    method = method ?? settings.twoFactorAuth.method;
    const { code } = await OTP.create({ 
      userId: this._id,
      expiresAt: Date.now() + 3600000
    });
    if(method === "sms")
      await sendMessage(this.phoneNumber, "Your verification code is: " + code);
    else if(method === "call")
      await sendCall(this.phoneNumber, otpConfig.voice(code));
    return code;
  }
  
  schema.methods.verifyOtp = async function (code: number) {
    return await OTP.findOneAndDelete({ userId: this._id, code }) !== null;
  };
};
