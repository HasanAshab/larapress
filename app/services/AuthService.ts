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
import Socialite from "Socialite";
import { sendMessage, sendCall } from "~/core/clients/twilio";
import User, { UserDocument } from "~/app/models/User";
import Settings, { ISettings } from "~/app/models/Settings";
import Token from "~/app/models/Token";
import OTP from "~/app/models/OTP";
import LoginAttemptLimitExceededException from "~/app/exceptions/LoginAttemptLimitExceededException";
import InvalidOtpException from "~/app/exceptions/InvalidOtpException";
import OtpRequiredException from "~/app/exceptions/OtpRequiredException";
import PhoneNumberRequiredException from "~/app/exceptions/PhoneNumberRequiredException";
import PasswordChangeNotAllowedException from "~/app/exceptions/PasswordChangeNotAllowedException";
import InvalidPasswordException from "~/app/exceptions/InvalidPasswordException";
import PasswordChangedMail from "~/app/mails/PasswordChangedMail";
import VerificationMail from "~/app/mails/VerificationMail";
import ForgotPasswordMail from "~/app/mails/ForgotPasswordMail";

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
    const failedAttemptCacheKey = `$_LOGIN_FAILED_ATTEMPTS(${email})`;
    const mutex = new Mutex();
    await mutex.acquire();
    let failedAttemptsCount = parseInt(await Cache.get(failedAttemptCacheKey) ?? 0);
    mutex.release();
    if(failedAttemptsCount > 3)
      throw new LoginAttemptLimitExceededException();
    const user = await User.findOne({ email, password: { $ne: null }});
    if(user && user.password) {
      if (await user.attempt(password)) {
        const { twoFactorAuth } = await user.settings;
        if(twoFactorAuth.enabled){
          if(!otp)
            throw new OtpRequiredException();
          const isValid = await this.verifyOtp(user, twoFactorAuth.method, otp);
          if (!isValid)
            throw new InvalidOtpException();
        }
        await Cache.clear(failedAttemptCacheKey);
        return user.createToken();
      }
      await mutex.acquire();
      await Cache.put(failedAttemptCacheKey, String(failedAttemptsCount + 1), 60 * 60);
      mutex.release();
    }
    return null;
  }
  
  async loginWithGoogle(code: string) {
    const { sub, name, email, picture } = await Socialite.driver("google").user(code);
    const user = await User.findOneAndUpdate(
      { "externalId.google": sub },
      { 
        email,
        verified: true,
        "logo.url": picture
      },
      { upsert: true, new: true }
    );
    if(user.username)
      return  URL.client("oauth/success?token=" + user.createToken());
    const token = user.createTemporaryToken("set-username");
    return URL.client("oauth/choose-username/?token=" + token);
  }
  
  async sendVerificationLink(user: UserDocument) {
    if (user.verified)
      return null;
    const link = await URL.signedRoute("email.verify", { id: user._id }, 259200);
    Mail.to(user.email).send(new VerificationMail({ link })).catch(log);
    return link;
  }
  
  async sendResetPasswordLink(user: UserDocument) {
    if(!user.password) return null;
    const { secret } = await Token.create({
      type: "resetPassword",
      key: user._id,
      expiresAt: Date.now() + 259200
    });
    const link = URL.client(`/password/reset/${user._id}?token=${secret}`);
    Mail.to(user.email).send(new ForgotPasswordMail({ link })).catch(log);
    return secret;
  }
  
  async resetPassword(user: UserDocument, token: string, password: string) {
    await Token.assertValid(user._id, "resetPassword", token);
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
  
  async generateRecoveryCodes(user: UserDocument, count = 10) {
    const rawCodes = [];
    const hashPromises = [];
    for (let i = 0; i < count; i++) {
    //TODO wrap this block in async
      const code = crypto.randomBytes(16).toString('hex');
      rawCodes.push(code);
      hashPromises.push(bcrypt.hash(code, config.get("bcrypt.rounds")));
    }
    user.recoveryCodes = await Promise.all(hashPromises);
    await user.save();
    return rawCodes;
  }
  
  async verifyRecoveryCode(user: UserDocument, code: string) {
    for (let i = 0; i < user.recoveryCodes.length; i++) {
      const hashedCode = user.recoveryCodes[i];
      if (await bcrypt.compare(code, hashedCode)) {
        user.recoveryCodes.splice(i, 1);
        await user.save();
        return true;
      }
    }
    return false;
  };

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