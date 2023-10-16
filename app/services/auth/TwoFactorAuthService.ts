import { singleton } from "tsyringe";
import { UserDocument } from "~/app/models/User";
import Settings from "~/app/models/Settings";
import OTP from "~/app/models/OTP";
import { sendMessage, sendCall } from "~/core/clients/twilio";
import config from "config";
import speakeasy from "speakeasy";
import PhoneNumberRequiredException from "~/app/exceptions/PhoneNumberRequiredException";

@singleton()
export default class TwoFactorAuthService {
  async enable(user, method) {
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