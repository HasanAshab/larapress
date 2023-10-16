import Cache from "Cache";
import URL from "URL";
import TwoFactorAuthService from "~/app/services/auth/TwoFactorAuthService";
import { singleton } from "tsyringe";
import { Mutex } from 'async-mutex';
import Socialite from "Socialite";
import User, { UserDocument } from "~/app/models/User";
import Token from "~/app/models/Token";
import LoginAttemptLimitExceededException from "~/app/exceptions/LoginAttemptLimitExceededException";
import InvalidOtpException from "~/app/exceptions/InvalidOtpException";
import OtpRequiredException from "~/app/exceptions/OtpRequiredException";

@singleton()
export default class AuthService {
  private readonly mutex: Mutex;
  
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {
    this.mutex = new Mutex();
  }
  
  async register(email: string, username: string, password: string, logo?){
    const user = new User({ email, username });
    await user.setPassword(password);
    logo && await user.attach("logo", logo);
    await user.save();
    return user.createToken();
  }
  
  async login(email: string, password: string, otp?: number) {
    await this.assertFailedAttemptLimitNotExceed(email);
    const user = await User.findOne({ email, password: { $ne: null }});
    if(!user?.password)
      return null;
    if (!await user.attempt(password)) {
      await this.incrementFailedAttempt(email);
      return null;
    }
    const { twoFactorAuth } = await user.settings;
    if(twoFactorAuth.enabled){
      if(!otp)
        throw new OtpRequiredException();
      const isValid = await this.twoFactorAuthService.verifyOtp(user, twoFactorAuth.method, otp);
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
    await this.mutex.acquire();
    let failedAttemptsCount = parseInt(await Cache.get(key) ?? 0);
    this.mutex.release();
    if(failedAttemptsCount > 3)
      throw new LoginAttemptLimitExceededException();
  }
  
  private async incrementFailedAttempt(email: string) {
    const key = this.getFailedAttemptCacheKey(email);
    await this.mutex.acquire();
    await Cache.increment(key);
    this.mutex.release();
  }

  private async resetFailedAttempts(email: string) {
    const key = this.getFailedAttemptCacheKey(email);
    await Cache.delete(key);
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
}