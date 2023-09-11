import { Schema, Document } from "mongoose";
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
  attempt(password: string): Promise<boolean>;
  sendVerificationEmail(): Promise<string>;
  sendResetPasswordEmail(): Promise<string | null>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  sendOtp(method: typeof otpConfig["methods"][number]): Promise<number>;
  verifyOtp(code: number): Promise<boolean>;
}

export default (schema: Schema) => {
  const expireAfter = 3 * 24 * 60 * 60;
  const twilioConfig = config.get<any>("twilio");
  const twilioClient = twilio(twilioConfig.sid, twilioConfig.authToken);

  schema.methods.setPassword = async function (password: string) {
    const bcryptRounds = config.get<number>("bcrypt.rounds");
    this.password = await bcrypt.hash(this.password, bcryptRounds);
  }
  
  schema.methods.attempt = function (password: string) {
    console.log(this.password)
    return bcrypt.compare(password, this.password);
  }
  
  schema.methods.sendVerificationEmail = async function () {
    if (this.verified)
      throw new Error("The user is already verified: \n" + this);
    const link = await URL.signedRoute("email.verify", { id: this._id }, expireAfter);
    await Mail.to(this.email).send(new VerificationMail({ link }));
    return link;
  };

  schema.methods.sendResetPasswordEmail = async function () {
    if(!this.password) return null;
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
      return false;
    }
    await this.setPassword(newPassword);
    this.tokenVersion++;
    const result = await this.save();
    Mail.to(this.email).send(new PasswordChangedMail());
    return true;
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
      await twilioClient.messages.create({
        from: twilioConfig.phoneNumber,
        to: this.phoneNumber,
        body: "Your verification code is: " + code,
      });
    }
    else if(method === "call") {
      await twilioClient.calls.create({
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
