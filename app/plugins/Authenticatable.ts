import { Schema, Document } from "mongoose";
import { customError } from "helpers";
import config from "config";
import twilio from "twilio";
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
  sendVerificationEmail(): Promise<string | boolean>;
  sendResetPasswordEmail(): Promise<string>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  sendOtp(method: typeof otpConfig["methods"][number]): number;
  verifyOtp(code: number): boolean;
}

export default (schema: Schema) => {
  const expireAfter = 3 * 24 * 60 * 60;
  const twilioConfig = config.get<any>("twilio");
  const twilioClient = twilio(twilioConfig.sid, twilioConfig.authToken);

  schema.methods.sendVerificationEmail = async function () {
    if (this.verified)
      throw new Error("The user is already verified: \n" + this.safeDetails());
    const link = await URL.signedRoute("email.verify", { id: this._id }, expireAfter);
    const result = await Mail.to(this.email).send(new VerificationMail({ link }));
    return link;
  };

  schema.methods.sendResetPasswordEmail = async function () {
    const { secret } = await Token.create({
      type: "resetPassword",
      key: this._id,
      expiresAt: Date.now() + expireAfter
    });
    const link = URL.client(`/password/reset/${this._id}?token=${secret}`);
    Mail.to(this.email).send(new ForgotPasswordMail({ link }));
    return secret;
  }
  
  schema.methods.resetPassword = async function (token: string, newPassword: string) {
    const tokenIsValid = await Token.isValid(this._id, "resetPassword", token);
    if (!tokenIsValid) {
      throw customError("INVALID_OR_EXPIRED_TOKEN");
    }
    this.password = newPassword;
    this.tokenVersion++;
    const result = await this.save();
    Mail.to(this.email).send(new PasswordChangedMail());
    return result;
  }
  
  schema.methods.sendOtp = async function (method: typeof otpConfig["methods"][number]) {
    if(!this.phoneNumber) return false;
    const code = Math.floor(100000 + Math.random() * 900000);
    const otp = await OTP.create({ 
      userId: this._id,
      code,
      expiresAt: Date.now() + 3600000
    });
    if(method === "sms") {
      twilioClient.messages.create({
        from: twilioConfig.phoneNumber,
        to: this.phoneNumber,
        body: "Your verification code is: " + code,
      });
    }
    else if(method === "call") {
      twilioClient.calls.create({
        from: twilioConfig.phoneNumber,
        to: this.phoneNumber,
        twiml: otpConfig.voice(code)
      });
    }
    return code;
  }
  
  schema.methods.verifyOtp = async function (code: number) {
    if(!this.phoneNumber) return false;
    const otp = await OTP.findOne({ userId: this._id, code });
    if(!otp) return false;
    OTP.deleteMany({ userId: this._id });
    return true;
  }
};
