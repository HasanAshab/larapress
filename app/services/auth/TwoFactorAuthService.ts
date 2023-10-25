import { singleton } from "tsyringe";
import { UserDocument } from "~/app/models/User";
import Settings from "~/app/models/Settings";
import OTP from "~/app/models/OTP";
import TwilioService from "~/app/services/TwilioService";
import Config from "Config";
import speakeasy from "speakeasy";
import PhoneNumberRequiredException from "~/app/exceptions/PhoneNumberRequiredException";

@singleton()
export default class TwoFactorAuthService {
  constructor(private readonly twilioService: TwilioService) {}
  
  async enable(user, method) {
    if (!user.phoneNumber && method !== "app")
      throw new PhoneNumberRequiredException();
    const data = { 
      recoveryCodes: await user.generateRecoveryCodes()
    };
    const twoFactorAuth = { enabled: true, method };
    if(method === "app") {
      const secret = speakeasy.generateSecret({ length: 20 });
      twoFactorAuth.secret = secret.ascii;
      const appName = Config.get<string>("app.name");
      data.otpauthURL = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: appName,
        issuer: appName,
      });
    }
    await Settings.updateOne({ userId: user._id }, { twoFactorAuth });
    return data;
  }
  
  async disable(user) {
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
      await this.twilioService.sendMessage(user.phoneNumber, "Your verification code is: " + code);
    else if(method === "call")
      await this.twilioService.makeCall(user.phoneNumber, `<Response><Say>Your verification code is ${code}</Say></Response>`);
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