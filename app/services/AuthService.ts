import app from "~/main/app";
import config from "config";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Cache from "Cache";
import URL from "URL";
import Mail from "Mail";
import speakeasy from "speakeasy";
import { singleton } from "tsyringe";
import { Mutex } from 'async-mutex';
import jwt from "jsonwebtoken";
import Socialite from "Socialite";
import { sendMessage, sendCall } from "~/core/clients/twilio";
import User, { UserDocument } from "~/app/models/User";
import Settings, { ISettings } from "~/app/models/Settings";
import Token from "~/app/models/Token";
import OTP from "~/app/models/OTP";
import LoginAttemptLimitExceededException from "~/app/exceptions/LoginAttemptLimitExceededException";
import InvalidOtpException from "~/app/exceptions/InvalidOtpException";
import InvalidTokenException from "~/app/exceptions/InvalidTokenException";
import OtpRequiredException from "~/app/exceptions/OtpRequiredException";
import PhoneNumberRequiredException from "~/app/exceptions/PhoneNumberRequiredException";
import PasswordChangeNotAllowedException from "~/app/exceptions/PasswordChangeNotAllowedException";
import InvalidPasswordException from "~/app/exceptions/InvalidPasswordException";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";

const mutex = new Mutex();

@singleton()
export default class AuthService {
  async register(email: string, username: string, password: string, logo?){
    const user = new User({ email, username });
    await user.setPassword(password);
    logo && await user.attach("logo", logo);
    await user.save();
    app.emit("Registered", user);
    return user.createToken();
  }
  
  async login(email: string, password: string, otp?: number) {
    await this.assertFailedAttemptLimitNotExceed(email);
    const user = await User.findOne({ email, password: { $ne: null }});
    if(!user?.password)
      return null;
    if (await user.attempt(password)) {
      await this.incrementFailedAttempt(email);
      return null;
    }
    const { twoFactorAuth } = await user.settings;
    if(twoFactorAuth.enabled){
      if(!otp)
        throw new OtpRequiredException();
      const isValid = await this.verifyOtp(user, twoFactorAuth.method, otp);
      if (!isValid) {
        await this.incrementFailedAttempt(email);
        throw new InvalidOtpException();
      }
    }
    await this.resetFailedAttempts(email);
    return user.createToken();
  }
  private getFailedAttemptCacheKey(email: string) {
    return `$_LOGIN_FAILED_ATTEMPTS(${email})`;
  }
  
  private async assertFailedAttemptLimitNotExceed(email: string) {
    const key = this.getFailedAttemptCacheKey(email);
    await mutex.acquire();
    let failedAttemptsCount = parseInt(await Cache.get(key) ?? 0);
    mutex.release();
    if(failedAttemptsCount > 3)
      throw new LoginAttemptLimitExceededException();
  }
  
  private async incrementFailedAttempt(email: string) {
    const key = this.getFailedAttemptCacheKey(email);
    await mutex.acquire();
    await Cache.incr(key);
    mutex.release();
  }
  private async resetFailedAttempts(email: string) {
    const key = this.getFailedAttemptCacheKey(email);
    await Cache.clear(key);
  }
  
  async loginWithExternalProvider(provider: string, code: string) {
    const externalUser = await Socialite.driver(provider).user(code);
    const user = await User.findOneAndUpdate(
      { [`externalId.${provider}`]: externalUser.id },
      { 
        name: externalUser.name,
        email: externalUser.email,
        verified: true,
        "logo.url": externalUser.picture
      },
      { new: true }
    );
    if(user) {
      return URL.client(`/login/social/${provider}/success/${user.createToken()}`);
    }
    const fields = externalUser.email ? "username" : "email,username";
    const token = await this.createExternalLoginFinalStepToken(provider, externalUser);
    return URL.client(`/login/social/${provider}/final-step/${externalUser.id}/${token}?fields=${fields}`);
  }
  
  async createExternalLoginFinalStepToken(provider: string, externalUser) {
    const { secret } = await Token.create({
      key: externalUser.id,
      type: provider + "Login",
      data: externalUser,
      expiresAt: Date.now() + 25920000
    });
    return secret;
  }
  
  async externalLoginFinalStep(provider: string, externalId: string, token: string, username: string, email?: string) {
    const externalUser = await Token.verify(externalId, provider + "Login", token);
    const user = await User.create({
      [`externalId.${provider}`]: externalUser.id,
      name: externalUser.name,
      email: externalUser.email ?? email,
      username,
      verified: true,
      "logo.url": externalUser.picture
    });
    return user.createToken();
  }
  
  async resetPassword(user: UserDocument, token: string, password: string) {
    await Token.verify(user._id, "resetPassword", token);
    await user.setPassword(password);
    user.tokenVersion++;
    await user.save();
    Mail.to(user.email).send(new PasswordChangedMail()).catch(log);
  }
  
  async changePassword(user: UserDocument, oldPassword: string, newPassword: string) {
    if(!user.password)
      throw new PasswordChangeNotAllowedException();
    if (!await user.attempt(oldPassword))
      throw new InvalidPasswordException();
    await user.setPassword(newPassword);
    user.tokenVersion++;
    await user.save();
    Mail.to(user.email).send(new PasswordChangedMail()).catch(log);
  }
  
  async enableTwoFactorAuth(user, method) {
    if (!user.phoneNumber && method !== "app")
      throw new PhoneNumberRequiredException();
    const data = { 
      recoveryCodes: await this.generateRecoveryCodes(user)
    };
    const twoFactorAuth = { enabled: true, method };
    if(method === "app") {
      const secret = speakeasy.generateSecret({ length: 20 });
      twoFactorAuth.secret = secret.ascii;
      const appName = config.get<string>("app.name");
      data.otpauthURL = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: appName,
        issuer: appName,
      });
    }
    await Settings.updateOne({ userId: user._id }, { twoFactorAuth });
    return data;
  }
  
  async disableTwoFactorAuth(user) {
    const { modifiedCount } = await Settings.updateOne({ userId: user._id }, { "twoFactorAuth.enabled": false });
    if(modifiedCount !== 1)
      throw new Error("Failed to disable two factor auth for user: " + user);
  }
  
  async sendOtp(user: UserDocument, method?: "sms" | "call") {
    if(!user.phoneNumber) return null;
    if(!method) {
      const { twoFactorAuth } = await user.settings;
      if(twoFactorAuth.method === "app") return null;
      method = twoFactorAuth.method;
    }
    const { code } = await OTP.create({ userId: user._id });
    if(method === "sms")
      await sendMessage(user.phoneNumber, "Your verification code is: " + code);
    else if(method === "call")
      await sendCall(user.phoneNumber, `<Response><Say>Your verification code is ${code}</Say></Response>`);
    return code;
  }
  
  async verifyOtp(user, method, code: number) {
    if(method !== "app")
      return await OTP.findOneAndDelete({ userId: user._id, code }) !== null;
    const { twoFactorAuth } = await user.settings;
    return speakeasy.totp.verify({
      secret: twoFactorAuth.secret,
      encoding: 'ascii',
      token: code,
      window: 2,
    });
  }
}