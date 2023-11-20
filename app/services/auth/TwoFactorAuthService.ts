import { singleton } from "tsyringe";
import { UserDocument } from "~/app/models/User";
import Settings, { ISettings } from "~/app/models/Settings";
import Token from "~/app/models/Token";
import TwilioService from "~/app/services/TwilioService";
import Config from "Config";
import speakeasy from "speakeasy";
import PhoneNumberRequiredException from "~/app/exceptions/PhoneNumberRequiredException";
import InvalidOtpException from "~/app/exceptions/InvalidOtpException";

@singleton()
export default class TwoFactorAuthService {
  constructor(private readonly twilioService: TwilioService) {}
  
  async enable(user: UserDocument, method?: ISettings["twoFactorAuth"]["method"]) {
    if (!user.phoneNumber && method !== "app")
      throw new PhoneNumberRequiredException();
    const data: { recoveryCodes: string[], otpauthURL?: string } = {
      recoveryCodes: await user.generateRecoveryCodes()
    };
    const twoFactorAuth: Partial<ISettings["twoFactorAuth"]> = { 
      enabled: true,
      secret: null,
      method
    };
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
  
  async disable(user: UserDocument) {
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
      const code = await this.createToken(user);
    if(method === "sms")
      await this.twilioService.sendMessage(user.phoneNumber, "Your verification code is: " + code);
    else if(method === "call")
      await this.twilioService.makeCall(user.phoneNumber, `<Response><Say>Your verification code is ${code}</Say></Response>`);
    return code;
  }
  
  async verifyOtp(user: UserDocument, method: "sms" | "call" | "app", code: string) {
    let isValid = false;
    
    if(method === "app") {
      const { twoFactorAuth } = await user.settings;
      if(!twoFactorAuth.secret)
        throw new Error("Trying to verify otp without generating secret of user: \n" + JSON.stringify(user, null, 2));
      isValid = speakeasy.totp.verify({
        secret: twoFactorAuth.secret,
        encoding: 'ascii',
        token: code,
        window: 2,
      });
    }
    else {
      isValid = await Token.isValid(user._id, "2fa", code);
    }
    
    if(!isValid)
      throw new InvalidOtpException();
  }
  
  generateOTPCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  async createToken(user: UserDocument) {
    const code = this.generateOTPCode().toString();
    await Token.create({
      key: user._id,
      type: "2fa",
      secret: code,
      expiresAt: Date.now() + 25920000
    });
    return code;
  }
}