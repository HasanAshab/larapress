import { Request } from "express";
import { deepMerge } from "helpers";
import Config from "Config";
import Cache from "Cache";
import Settings from "~/app/models/Settings";

export default class SettingsController {
  async index(req: Request) {
    return await req.user.settings;
  }
  
  async notification(req: Request) {
    await Settings.updateOne({ userId: req.user._id }, { notification: req.validated });
    return { message: "Settings saved!" }
  }
  
  async enableTwoFactorAuth(req: Request){
    const { otp, method } = req.validated;
    const isValidOtp = await req.user.verifyOtp(parseInt(otp));
    if (!isValidOtp){
      return {
        status: 401,
        message: "Invalid OTP. Please try again!",
      };
    }
    await Settings.updateOne(
    { userId: req.user._id },
    {
      twoFactorAuth: {
        enabled: true,
        method
      }
    }
    );
    return { message: `Two Factor Auth enabled!`};
  }
  
  async getAppSettings() {
    return { data: config };
  }
  
  async updateAppSettings(req: Request) {
    for(key in req.validated){
      Config.set(key, req.validated[key])
    }
    return { message: "Settings updated!" }
  }
}

