import app from "~/main/app";
import config from "config";
import { singleton } from "tsyringe";
import Cache from "Cache";
import { Mutex } from 'async-mutex';
import { sendMessage, sendCall } from "~/core/clients/twilio";
import speakeasy from "speakeasy";
import User from "~/app/models/User";
import Settings, { ISettings } from "~/app/models/Settings";
import OTP from "~/app/models/OTP";
import LoginAttemptLimitExceededException from "~/app/exceptions/LoginAttemptLimitExceededException";
import InvalidOtpException from "~/app/exceptions/InvalidOtpException";
import InvalidCredentialException from "~/app/exceptions/InvalidCredentialException";

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
          if(!otp) {
            return {
              twoFactorAuthRequired: true,
              message: "Credentials matched. otp required!"
            };
          }
          const isValid = await this.verifyOtp(user, twoFactorAuth.method, parseInt(otp));
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
    throw new InvalidCredentialException();
  }
  
  async enableTwoFactorAuth(user, method) {
    if (!user.phoneNumber && method !== "app")
      throw new Error("User phone number is required for sms or call method (2FA)");
    const data = { 
      recoveryCodes: await user.generateRecoveryCodes()
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
    return modifiedCount === 1;
  }
  
  async sendOtp(user, method?) {
    if(!user.phoneNumber)
      throw new Error("User phone number is required sending OTP (2FA)");
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