import { Schema, Document } from "mongoose";
import config from "config";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Mail from "Mail";
import Token from "~/app/models/Token";
import EmailVerificationNotification from "~/app/notifications/EmailVerificationNotification";
import ForgotPasswordNotification from "~/app/notifications/ForgotPasswordNotification";

export interface AuthenticatableDocument extends Document {
  setPassword(password: string): Promise<void>;
  attempt(password: string): Promise<boolean>;
}

export default (schema: Schema) => {
  schema.methods.attempt = function (password: string) {
    return bcrypt.compare(password, this.password);
  }

  schema.methods.setPassword = async function (password: string) {
    this.password = await bcrypt.hash(password, config.get("bcrypt.rounds"));
  }
  
  schema.methods.sendVerificationNotification = async function() {
    await this.notify(new EmailVerificationNotification);
  }
  
  schema.methods.sendResetPasswordNotification = async function() {
    await this.notify(new ForgotPasswordNotification);
  }

  schema.methods.generateRecoveryCodes = async function(count = 10) {
    const rawCodes = [];
    const hashPromises = [];
    for (let i = 0; i < count; i++) {
    //TODO wrap this block in async
      const code = crypto.randomBytes(16).toString('hex');
      rawCodes.push(code);
      hashPromises.push(bcrypt.hash(code, config.get("bcrypt.rounds")));
    }
    this.recoveryCodes = await Promise.all(hashPromises);
    await this.save();
    return rawCodes;
  }
  
  schema.methods.verifyRecoveryCode = async function(code: string) {
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
