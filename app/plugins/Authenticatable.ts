import { Schema, Document } from "mongoose";
import config from "config";
import Token from "~/app/models/Token";
import Mail from "Mail"
import URL from "URL"
import bcrypt from "bcryptjs";
import crypto from "crypto";
import VerificationMail from "~/app/mails/VerificationMail";
import ForgotPasswordMail from "~/app/mails/ForgotPasswordMail";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";


export interface AuthenticatableDocument extends Document {
  setPassword(password: string): Promise<void>;
  attempt(password: string): Promise<boolean>;
  sendVerificationEmail(): Promise<string>;
  sendResetPasswordEmail(): Promise<string | null>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
}

export default (schema: Schema) => {
  const bcryptRounds = config.get<number>("bcrypt.rounds");

  schema.methods.setPassword = async function (password: string) {
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
    
  schema.methods.generateRecoveryCodes = async function(count = 10) {
    const rawCodes = [];
    const hashPromises = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(16).toString('hex');
      rawCodes.push(code);
      hashPromises.push(bcrypt.hash(code, bcryptRounds));
    }
    this.recoveryCodes = await Promise.all(hashPromises);
    await this.save();
    return rawCodes;
  }

  schema.methods.verifyRecoveryCode = async function(code) {
    for (let i = 0; i < this.recoveryCodes.length; i++) {
      const hashedCode = this.recoveryCodes[i];
      if (await bcrypt.compare(code, hashedCode)) {
        this.recoveryCodes.splice(i, 1);
        await this.save();
        return true;
      }
    }
    return false;
  };
};
