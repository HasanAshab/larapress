import app from "~/main/app";
import config from "config";
import { singleton } from "tsyringe";
import { sendMessage, sendCall } from "~/core/clients/twilio";
import speakeasy from "speakeasy";
import User from "~/app/models/User";
import Settings, { ISettings } from "~/app/models/Settings";
import OTP from "~/app/models/OTP";

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