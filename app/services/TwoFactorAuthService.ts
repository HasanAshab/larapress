import config from "config";
import { sendMessage, sendCall } from "~/core/services/twilio";
import speakeasy from "speakeasy";
import Settings from "~/app/models/Settings";
import OTP from "~/app/models/OTP";

export default class TwoFactorAuthService {
  async enable(user, method) {
    const twoFactorAuth = { enabled: true, method };
    if(method !== "app") {
      if (!user.phoneNumber) return false;
      await Settings.updateOne({ userId: user._id }, { twoFactorAuth });
      return true;
    }
    const secret = speakeasy.generateSecret({ length: 20 });
    twoFactorAuth.secret = secret.ascii;
    await Settings.updateOne({ userId: user._id }, { twoFactorAuth });
    const appName = config.get<string>("app.name");
    return speakeasy.otpauthURL({
      secret: secret.ascii,
      label: appName,
      issuer: appName,
    });
  }
  
  async disable(user) {
    const { modifiedCount } = await Settings.updateOne({ userId: user._id }, { "twoFactorAuth.enabled": false });
    return modifiedCount === 1;
  }
  
  async sendOtp(user, method?) {
    if(!user.phoneNumber) return null;
    if(!method) {
      const { twoFactorAuth } = await user.settings;
      if(twoFactorAuth.method === "app") return null;
      method = twoFactorAuth.method;
    }
    console.log(user, method)
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