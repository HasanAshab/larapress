import { Request } from "express";
import config from "config";
import Settings from "app/models/Settings";

export default class SettingsController {
  async index(req: Request) {
    return await req.user.settings;
  }
  
  async notification(req: Request) {
    console.log(req.validated)
    const { modifiedCount } = await Settings.updateOne({ userId: req.user._id }, { notification: req.validated });
    return modifiedCount === 1
      ? { message: "Settings saved!" }
      : { status: 500, message: "Faild to update settings!" };
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
    Object.assign(config, req.validated);
    return { message: "Settings updated!" }
  }
}

